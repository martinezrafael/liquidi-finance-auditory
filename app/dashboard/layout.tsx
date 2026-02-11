"use client";

import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* No futuro, sua <Sidebar /> entrará aqui.
          Por enquanto, apenas garantimos que o container 
          ocupe a tela toda com um fundo neutro. 
      */}
      <div className="flex-1 flex flex-col">
        {/* Aqui entrará sua <Topbar /> */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
