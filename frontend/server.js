import express from 'express';
import favicon from 'express-favicon';
import path from 'path';

const port = process.env.PORT || 8080;
const app = express();

app.use(favicon(__dirname + '/build/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));


app.listen(port);