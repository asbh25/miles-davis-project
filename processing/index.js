const neo4j = require('neo4j-driver').v1;
const fs    = require('fs');
// reading music files to create database entries
const musicFile  = fs.readFileSync('./dataset/music.json');
const musicians  = JSON.parse(musicFile);
const albumsFile = fs.readFileSync('./dataset/albums.json');
const albums     = JSON.parse(albumsFile);
const tracksFile = fs.readFileSync('./dataset/tracks.json');
const tracks     = JSON.parse(tracksFile);
// reading configs
const configFile = fs.readFileSync('./processing/config.json');
const config     = JSON.parse(configFile);
const url        = config.url;
const username   = config.username;
const password   = config.password;
// staff to handle database requests

var driver  = null;
var session = null;
try{   
  driver  = neo4j.driver(url, neo4j.auth.basic(username, password));
  session = driver.session();

  if(process.argv[2] === 'clear'){
    clearDatabase().then(() => {
      console.log('deleted items from the database.');
      session.close();
      driver.close();
    })
  }else{
    fillDatabase().then(() => {
      console.log('added all initial values into the database.');
      session.close();
      driver.close();
    })
  }
}catch (err){
  console.log('terminating program.')
  console.error(err)
}
// filling database with initial values
async function fillDatabase(){  
  // promises.push(addAllAlbumsIntoDB(albums));
  // promises.push(addInstrumentsToDatabase(getAllInstruments(musicians)));
  // promises.push(addAllMusiciansToDB(musicians));
  // promises.push(addAllTracksToDB(tracks));
  try{
    await addAllAlbumsIntoDB(albums);
    await addAllTracksToDB(tracks);
  }catch(err){
    console.log('error occured.');
    console.log(err);
  }
}
// removing all entries from the database
async function clearDatabase(){
  await session.run(`match ()-[r]-() delete r`)
  .then(() => console.log('removing all relations'))
  .catch(err => {
      console.log('error occured')
      console.log(err);
  });

  await session.run(`match (n) delete n`)
  .then(() => console.log('removing all entries'))
  .catch(err => {
      console.log('error occured')
      console.log(err);
  });  
}

async function addAllTracksToDB(tracks){
  const allTracks = [];

  Object.entries(tracks).forEach(album => {
    Object.entries(album[1].tracks).forEach(track => {
      allTracks.push(track);
    });
  });

  for(track of allTracks) {
    await addTrackToDB(track);
  };
  console.log(`${allTracks.length} albums added to the database`);
}
// adding one track to database
async function addTrackToDB(track){
  await session.run(`merge (n:Track {name: $name, writer: $writer}) return n`, 
  {name: track[0], writer: track[1].writer})
  .catch(err => {
    console.log(`cannot create track ${track[0]}`);
    console.log(err);
  })
}
// adding all musicians to database
async function addAllMusiciansToDB(musicians){
  const promises = [];
  Object.keys(musicians).forEach(musician => {
    promises.push(addMusicianToDB(musician));
  });

  await Promise.all(promises)
  .then(() => console.log(`${promises.length} musicians successfully added.`))
  .catch(err => { 
    console.log('error occured in adding musicians into the database');
    console.log(err);
   });
}
async function addMusicianToDB(musician){
  await session.run('create (a:Musician {name: $name}) return a', {name: musician})
  .catch(err => { 
    console.log(`musician ${musician} cannot be added`);
    console.log(err);
  });
}
// remove all instruments from db
async function removeAllInstrumentsFromDB(){
  await session.run(`match (n:Instrument) delete n`)
  .then(() => console.log('removing all instruments succeeded'))
  .catch(err => {
      console.log('error occured')
      console.log(err);
  });
}
// removing all musicians from database
async function removeAllMusiciansFromDB(){
  await session.run(`match (n:Musician) delete n`)
  .then(() => console.log('removing all musicians succeeded'))
  .catch(err => {
      console.log('error occured')
      console.log(err);
  });
}
// removing all albums from database
async function removeAllAlbumsFromDB(){
  await session.run(`match (n:Album) delete n`)
  .then(() => console.log('removing all albums succeeded'))
  .catch(err => {
      console.log('error occured')
      console.log(err);
  });
}
// getting all instruments of all musicians
function getAllInstruments(musicians) {
  var instruments = new Set();
  Object.entries(musicians).forEach(musician => {
    musician[1].tracks.forEach(track => {
        instruments.add(track.instrument);
    })
  });
  return instruments;
}

// adding all albums into the database
async function addAllAlbumsIntoDB(albums){ 
  const promises = [];

  Object.entries(albums).forEach(album => promises.push(addAlbumIntoDB(album)));

  await Promise.all(promises)
  .then(result => {
    console.log(`${result.length} albums added to the database`)
  })
  .catch(err => {
    console.log('error occured');
    console.log(err);
  });
}
// adding albums into the database
async function addAlbumIntoDB(album){
  try{
    await session.run(
      `create (n:Album {name: $name, label: $label, released: $released,
      url: $url, recorded: $recorded, studios: $studios, producers: $producers}) return n.name`,
      {
        name: album[0], label: album[1].label, 
        released: album[1].released, url: album[1].url, 
        recorded: album[1].recorded, studios: album[1].studios,
        producers: album[1].producers
      }
    );
  }catch(err){
    console.log(`error in album ${album}`)
    console.log(err);
  }
}
//adding all instruments into the database
async function addInstrumentsToDatabase(data){
  const promises = [];

  data.forEach(instrument => {
      promises.push(addInstrumentToDB(instrument));
  });

  await Promise.all(promises)
  .then((results) => {
    console.log(`${results.length} instruments are added successfuly`)
  })
  .catch (err => {
    console.log('error occured')
    console.log(err)
  });
}
// async function to add instrument into the database
async function addInstrumentToDB(name){
  try{
    await session.run(
      'create (n:Instrument {name: $name}) return n.name',
      {name: name}
    );
  }catch(err){
    console.log(err);
  }
}