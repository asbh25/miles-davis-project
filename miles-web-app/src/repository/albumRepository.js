var config = require('../assets/config.json');
var albums = require(`../assets/${config["dataset_directory"]}/albums.json`);
/**
 * @author Pavlo Rozbytskyi
 * album Data Access Object layer provides basic read functionality  
 */
class AlbumRepository {
  constructor() {
    this.allAlbums = albums.map(elem => {
      var obj = {};
      obj[0] = elem.id;
      obj[1] = {
        url: elem.url,
        icon: elem.icon,
        label: elem.label,
        released: elem.released,
        recorded: elem.recorded,
        studios: elem.studios,
        producers: elem.producers,
        musicians: elem.musicians,
      };
      return obj;
    });
  }
  // reading all albums
  getAll = () => {
    return this.allAlbums;
  }
}

export const albumRepository = new AlbumRepository()