// This is db model of Game
// Table name: games
// +---------------------+--------------+------+-----+---------+----------------+
// | Field               | Type         | Null | Key | Default | Extra          |
// +---------------------+--------------+------+-----+---------+----------------+
// | id                  | int          | NO   | PRI | NULL    | auto_increment |
// | title               | varchar(255) | NO   |     | NULL    |                |
// | types               | json         | YES  |     | NULL    |                |
// | developers          | json         | YES  |     | NULL    |                |
// | publisher           | int          | YES  | MUL | NULL    |                |
// | description         | text         | YES  |     | NULL    |                |
// | release_date        | datetime     | YES  |     | NULL    |                |
// | size                | decimal(5,2) | YES  |     | NULL    |                |
// | cover_img_url       | varchar(255) | YES  |     | NULL    |                |
// | supported_platforms | json         | NO   |     | NULL    |                |
// +---------------------+--------------+------+-----+---------+----------------+


// Meta data game model
// Table name: gameStoreRelatedIn4
// +----------------+--------------+------+-----+---------+-------+
// | Field          | Type         | Null | Key | Default | Extra |
// +----------------+--------------+------+-----+---------+-------+
// | id             | int          | NO   | PRI | NULL    |       |
// | reviews        | json         | YES  |     | NULL    |       |
// | original_price | decimal(6,2) | NO   |     | NULL    |       |
// | price          | decimal(6,2) | NO   |     | NULL    |       |
// +----------------+--------------+------+-----+---------+-------+