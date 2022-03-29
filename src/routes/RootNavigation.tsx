/* eslint-disable prettier/prettier */
import React, { createRef } from 'react';

export const navigationRef = createRef<any>();

export function goBack() {
  navigationRef.current?.goBack();
}

export function navigate(route: string, options?: any) {
  navigationRef.current?.navigate(route, { ...options });
}
