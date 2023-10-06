import React from 'react'
import 'assets/styles/index.scss'
import Routes from 'pages/routes'

import { genTestUserSig } from 'utils/GenerateTestUserSig.js'
import TRTCCalling from 'trtc-calling-js'

const SDKAPPID = genTestUserSig('').sdkAppID
const user = JSON.parse(localStorage.getItem('user')!);

export const TrtcCalling = new TRTCCalling({
    SDKAppID: SDKAPPID,
    CallTimeout: 90
})

let trtcId;

if (user && user.last_name) {
    trtcId = `${user.last_name}`;
} else {
    trtcId = "crossware"
}

const { userSig } = genTestUserSig(trtcId)

TrtcCalling.login({
    userID: trtcId,
    userSig,
})

export const App: React.FC = () => <Routes />
