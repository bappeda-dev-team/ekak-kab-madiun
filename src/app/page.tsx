'use client'

import React, { useState, useEffect } from "react";
import { getUser } from "@/components/lib/Cookie";

const Dashboard = () => {

  const [User, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = getUser();
    if (fetchUser) {
      setUser(fetchUser.user);
    }
  }, [])

  return (
    <>
      <h1 className="p-5 rounded-xl border border-emerald-500">Selamat Datang, {User?.nama_pegawai ? User?.nama_pegawai : 'di halaman dashboard'}</h1>
    </>
  )
}

export default Dashboard;