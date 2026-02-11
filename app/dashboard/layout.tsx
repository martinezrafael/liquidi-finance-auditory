"use client";

import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
