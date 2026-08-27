-- Page tree and one text element for the E2E tests.

DELETE FROM `pages` WHERE `uid` = 1;
INSERT INTO `pages` (`uid`, `pid`, `tstamp`, `crdate`, `deleted`, `hidden`, `doktype`, `title`, `slug`, `is_siteroot`, `TSconfig`)
VALUES (1, 0, UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0, 0, 1, 'Home', '/', 1, 'RTE.default.preset = no_translate');

DELETE FROM `tt_content` WHERE `uid` = 1;
INSERT INTO `tt_content` (`uid`, `pid`, `tstamp`, `crdate`, `deleted`, `hidden`, `CType`, `colPos`, `header`, `bodytext`)
VALUES (1, 1, UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0, 0, 'text', 0, 'Rich text element', '<p>Ask for Bic Cristal pens</p>');
