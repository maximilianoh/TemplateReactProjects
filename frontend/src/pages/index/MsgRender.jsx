import React, { useEffect, useState } from 'react';
import axios from 'axios';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';

const MsgRender = (props) => {
  const { url } = props;
  const [msg, setMsg] = useState('Nothing');
  const [AsyncComponent, setAsyncComponent] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const getData = await axios.post(url, { text2: 'Something' });
        if (getData.data && getData.data.msg) setMsg(getData.data.msg);
      } catch (err) {
        console.dir(err); // eslint-disable-line no-console
      }
    }
    fetchData();

    const fetchAsyncComponent = () => loadable(() => import('./AsyncExample'));
    setAsyncComponent(fetchAsyncComponent());
  }, []);
  const ComponentLoaded = AsyncComponent === null ? React.Fragment : AsyncComponent;
  return (
    <>
      <div id="msg">{msg}</div>
      <ComponentLoaded />
    </>
  );
};
export default MsgRender;

MsgRender.propTypes = {
  url: PropTypes.string.isRequired,
};
