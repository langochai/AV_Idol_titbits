const BaseModel = require("./base.model");

class ActressModel extends BaseModel {
  async displayAllActress() {
    let sql = `SELECT * FROM ACTORS`;
    return await this.querySql(sql);
  }

  async displayOldest() {
    let sql = `SELECT * FROM ACTORS ORDER BY ID DESC`;
    return await this.querySql(sql);
  }

  async displayByAgeAcd() {
    let sql = `SELECT * FROM ACTORS ORDER BY AGE`;
    return await this.querySql(sql);
  }

  async getActressByID(id) {
    let sql = `SELECT * FROM ACTORS WHERE ID = ${id}`;
    return await this.querySql(sql);
  }

  async findByName(name) {
    let sql = `SELECT ID FROM ACTORS WHERE NAME LIKE '%${name}%'`;
    return await this.querySql(sql);
  }

  async getTags(idActor) {
    let sql = `SELECT * FROM tags JOIN actorTags ON tags.id = actorTags.tagID
JOIN actors on actorTags.actorID = actors.id  where  actors.id = ${idActor} ;`;
    return await this.querySql(sql);
  }

  async deleteActressByID(id) {
    let sql = `DELETE FROM ACTORS WHERE ID = ${id}`;
    return await this.querySql(sql);
  }

  async addActress(
    idolName,
    idolAge,
    idolHeight,
    idolWeight,
    idolBust,
    idolWaist,
    idolHip,
    idolUrlTxt
  ) {
    let sql = `INSERT INTO ACTORS(NAME,AGE,HEIGHT,WEIGHT,BUST_SIZE,WAIST_SIZE,HIP_SIZE,URLTXT)
    VALUES ('${idolName}','${idolAge}',${idolHeight},${idolWeight},${idolBust},${idolWaist},${idolHip},'${idolUrlTxt}')`;
    return await this.querySql(sql);
  }

  async updateActress(
    id,
    idolName,
    idolAge,
    idolHeight,
    idolWeight,
    idolBust,
    idolWaist,
    idolHip,
    idolUrlTxt
  ) {
    let sql = `CALL UPDATEACTOR(${id}, '${idolName}', ${idolAge},${idolHeight},${idolWeight},${idolBust},${idolWaist},${idolHip},'${idolUrlTxt}')`;
    return await this.querySql(sql);
  }
}

module.exports = new ActressModel();
