import React from 'react'
import Container from "components/Container";

const LoginLayout = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined }) => (
    <Container>
        {props.children}
    </Container>
)

export default LoginLayout