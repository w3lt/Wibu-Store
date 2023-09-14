// This is db model of User meta data
// Table name: users
// +------------+--------------+------+-----+---------+-------+
// | Field      | Type         | Null | Key | Default | Extra |
// +------------+--------------+------+-----+---------+-------+
// | uid        | int unsigned | NO   | PRI | NULL    |       |
// | email      | varchar(255) | YES  | UNI | NULL    |       |
// | username   | varchar(255) | NO   |     | NULL    |       |
// | password   | varchar(255) | NO   | UNI | NULL    |       |
// | gender     | tinyint      | YES  |     | NULL    |       |
// | dob        | datetime     | YES  |     | NULL    |       |
// | created_at | datetime     | NO   |     | NULL    |       |
// +------------+--------------+------+-----+---------+-------+