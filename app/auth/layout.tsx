"use client";

import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AuthLayout;
