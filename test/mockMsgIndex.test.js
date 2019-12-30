import React from 'react';
import { render, act, cleanup} from '@testing-library/react';
import axiosMock from "axios";
import MsgRender from "components/pages/index/MsgRender";
import { errorMsg } from "components/__mocks__/mockMsgIndex";

jest.mock('axios');
afterEach(cleanup);
/*
beforeEach(() => {
    component = render(<MsgRender url="/test/test2"/>);
    rerender = component.rerender
});
*/

test('Not Axios Msg', async () => {
    axiosMock.post.mockResolvedValueOnce({ });
    await act(async () => { render(<MsgRender url="not/url/exist" />) });
    expect(document.querySelector("#msg").textContent).toEqual('Nothing');
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
});

test('Show Axios Msg', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: errorMsg });
    await act(async () => { render(<MsgRender url="/test/test2" />) });
    expect(document.querySelector("#msg").textContent).toEqual(errorMsg.msg);
    expect(axiosMock.post).toHaveBeenCalledTimes(2);
});



