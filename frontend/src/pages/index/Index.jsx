import React from 'react';
import ReactDOM from 'react-dom';
import MsgRender from './MsgRender';

const Index = () => <MsgRender url="http://127.0.0.1:3005/test/test2" />;
ReactDOM.render(<Index />, document.getElementById('app'));
