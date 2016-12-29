-- Adminer 4.2.4 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `laisse_article`;
CREATE TABLE `laisse_article` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(60) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` datetime NOT NULL,
  `posted_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_users_posted_by` (`posted_by`),
  CONSTRAINT `fk_users_posted_by` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `laisse_article` (`id`, `title`, `content`, `created_at`, `posted_by`) VALUES
(1, '1er article',  'im the 3em aricle\r\n\r\nia deserunt mollit anim id est laborum.\r\n', '2016-09-05 20:19:43',  1),
(2, '2em article',  'i\'m the contenu de l\'article 2', '2016-05-05 22:31:52',  1),
(3, '3èm article',  'je suis l\'article 3 et l\'id 3',  '2016-05-06 17:05:48',  1),
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(60) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'Developpeur', 'dev', 'dev',  '2016-09-06 17:45:27'),

-- 2016-09-09 12:21:27