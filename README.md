## Web Socket

Package for web socket management.

![npm](https://img.shields.io/npm/v/@mertsolak/web-socket)
![license](https://img.shields.io/npm/l/@mertsolak/web-socket)
![size](https://img.shields.io/bundlephobia/min/@mertsolak/web-socket)
![issue](https://img.shields.io/github/issues/mert-solak/web-socket)

## Installation

Use node package manager to install @mertsolak/web-socket.

```bash
npm i @mertsolak/web-socket
```

## Basic Usage

```typescript
import React, { useEffect } from 'react';
import { Socket } from '@mertsolak/web-socket';

export const App = () => {
  useEffect(() => {
    const socket = new Socket('ws://localhost:4000');

    socket.onError = (event) => {
      console.log('error', event);
    };
    socket.onMessage = (event) => {
      console.log('message', event);
    };
    socket.onClose = (event) => {
      console.log('close', event);
    };
    socket.onOpen = (event) => {
      console.log('open', event);
    };

    socket.connect();
    socket.listen((data) => {
      console.log('second listen', data);
    });
  }, []);

  return <p>App</p>;
};
```
