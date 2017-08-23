import express from 'express';
import path from 'path';

import webpackConfig from './config/webpackConfig';

const app = express();

const port = 3000;

app.listen(port, err => {
	if (err) throw err;

	console.log(`Server listening on port ${port}`);
});

app.use("/dist", express.static('dist'));

webpackConfig(app);

let User = {
	lastname: 'Иванов',
	name: 'Иван',
	surname: 'Иванов',
	list: ['Не указан', 'Гость', 'Пользователь', 'Админ']
};

app.get('/api/user/id', (req, res) => {
	res.json(User);
});

app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname, "../index.html"));
});