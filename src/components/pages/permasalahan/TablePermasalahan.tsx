'use client'

import { ButtonSkyBorder, ButtonBlackBorder } from "@/components/global/Button";
import React, { useState, useEffect } from "react";
import { LoadingSync } from "@/components/global/Loading";
import { TbPencil, TbCheckbox } from "react-icons/tb";
import { AlertQuestion } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";

interface Table {
    kode_opd: string;
    tahun: string;
}

interface Pohon {
    id: number;
    parent: number;
    nama_pohon: string;
    level_pohon: number;
    is_active: boolean;
    childs: Pohon[]
}

export const TablePermasalahan: React.FC<Table> = ({ kode_opd, tahun }) => {

    const [Pohon, setPohon] = useState<Pohon[]>([]);

    const [DataNull, setDataNull] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchPohon = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/pohon_kinerja_opd/findall/${kode_opd}/${tahun}`, {
                    headers: {
                        'Authorization': `${token}`
                    }
                });
                const result = await response.json();
                if (result.code === 200 || result.code === 2001) {
                    if (result.data.childs.length === 0) {
                        setDataNull(true);
                        setError(false)
                        setPohon([]);
                    } else {
                        setDataNull(false);
                        setError(false);
                        setPohon(result.data.childs);
                    }
                } else {
                    setError(true);
                    setPohon([]);
                }
            } catch (err) {
                console.log(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchPohon();
    }, [kode_opd, tahun, token]);

    if (Loading) {
        return (
            <div className="overflow-auto m-2 rounded-xl border">
                <LoadingSync />
            </div>
        )
    } else if (Error) {
        return (
            <div className="overflow-auto m-2 rounded-xl border">
                <h1 className="p-4 text-red-500 font-semibold">Error, periksa koneksi internet atau database server. terdapat kesalahan di backend</h1>
            </div>
        )
    }

    return (
        <div className="overflow-auto m-2 rounded-t-xl border">
            <table className="w-full">
                <thead>
                    <tr className="bg-emerald-500 border border-emerald-500 text-white">
                        <th className="border-r border-b px-3 py-3 max-w-[50px] text-center">No</th>
                        <th colSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">Masalah Pokok</th>
                        <th colSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">Masalah</th>
                        <th colSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">Akar Masalah</th>
                    </tr>
                </thead>
                {DataNull ?
                    <tbody>
                        <tr>
                            <td colSpan={30} className="p-4 font-semibold">Data Pohon Kinerja Kosong / Belum di tambahkan di tahun {tahun}</td>
                        </tr>
                    </tbody>
                    :
                    <tbody>
                        {Pohon.map((p: Pohon, index: number) => {
                            const haveChilds = p.childs && Array.isArray(p.childs) && p.childs.length > 0;
                            const rowPertama = haveChilds
                                ? p.childs.reduce((totalTactical, childTactical) => {
                                    let totalOperational = 0; // Hitung child lapisan pertama itu sendiri
                                    if (childTactical.childs) {
                                        totalOperational += childTactical.childs.length; // Tambahkan jumlah anak lapisan kedua
                                        childTactical.childs.forEach(childOperational => {
                                            if (childOperational.childs) {
                                                totalOperational += childOperational.childs.length; // Tambahkan jumlah anak lapisan ketiga
                                            } else {
                                                totalOperational += 2;
                                            }
                                        });
                                    } else {
                                        totalOperational += 2;
                                    }
                                    return totalTactical + 1 + totalOperational;
                                }, 2) // Inisialisasi total dengan 1 untuk 'p' itu sendiri
                                : 2; // Jika tidak ada anak, rowSpan adalah 1 (untuk 'p')

                            const TotalRow = p.childs ?
                                p.childs.reduce((tactical, itemTactical) => {
                                    let total = 0; // Hitung item itu sendiri
                                    if (itemTactical.childs) {
                                        tactical += itemTactical.childs.length; // Tambah jumlah anak level kedua
                                    } else {
                                        tactical + 2;
                                    }
                                    return tactical + total + 1 ;
                                }, 2)
                                :
                                2; // Tambah 1 untuk 'p' jika ada anak, atau 1 jika tidak ada

                            return (
                                // Strategic
                                <React.Fragment key={p.id || index}>
                                    <tr>
                                        <td rowSpan={TotalRow} className="border-x border-b border-emerald-500 px-3 py-4 text-center">{index + 1}</td>
                                        <td rowSpan={TotalRow} className="border-r border-b border-emerald-500 px-6 py-4 bg-red-200">{p.nama_pohon} - {TotalRow}</td>
                                        <td rowSpan={TotalRow} className="border-r border-b border-emerald-500 px-6 py-4 max-w-[150px]">
                                            <div className="flex flex-col justify-center items-center gap-2">
                                                <ButtonSkyBorder
                                                    className="w-full"
                                                >
                                                    <TbPencil className="mr-1" />
                                                    Edit
                                                </ButtonSkyBorder>
                                                <ButtonBlackBorder className="w-full"
                                                    onClick={() => {
                                                        AlertQuestion("Hapus?", "Hapus Renaksi OPD yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                            if (result.isConfirmed) {

                                                            }
                                                        });
                                                    }}
                                                >
                                                    <TbCheckbox className="mr-1" />
                                                    Pilih
                                                </ButtonBlackBorder>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* TACTICAL */}
                                    {!p.childs ?
                                        <tr>
                                            <td colSpan={30} className="p-6 font-semibold bg-red-400 border border-emerald-500 text-white">tidak ada anak pohon</td>
                                        </tr>
                                        :
                                        p.childs.map((t: Pohon, sub_index: number) => (
                                            <React.Fragment key={t.id || sub_index}>
                                                <tr>
                                                    <td rowSpan={t.childs ? t.childs.length + 1 : 2} className="border-r border-b border-emerald-500 px-6 py-4 bg-blue-200">{t.nama_pohon} - {t.childs ? t.childs.length + 1 : 2}</td>
                                                    <td rowSpan={t.childs ? t.childs.length + 1 : 2} className="border-r border-b border-emerald-500 px-6 py-4 max-w-[150px]">
                                                        <div className="flex flex-col justify-center items-center gap-2">
                                                            <ButtonSkyBorder
                                                                className="w-full"
                                                            >
                                                                <TbPencil className="mr-1" />
                                                                Edit
                                                            </ButtonSkyBorder>
                                                            <ButtonBlackBorder className="w-full"
                                                                onClick={() => {
                                                                    AlertQuestion("Hapus?", "Hapus Renaksi OPD yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                        if (result.isConfirmed) {

                                                                        }
                                                                    });
                                                                }}
                                                            >
                                                                <TbCheckbox className="mr-1" />
                                                                Pilih
                                                            </ButtonBlackBorder>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {/* OPERATIONAL */}
                                                {!t.childs ?
                                                    <tr>
                                                        <td colSpan={2} className="p-6 font-semibold bg-red-400 border border-emerald-500 text-white">tidak ada anak pohon</td>
                                                    </tr>
                                                    :
                                                    t.childs.map((o: Pohon, subsub_index: number) => (
                                                        <tr key={o.id || subsub_index}>
                                                            <td className="border-r border-b border-emerald-500 px-6 py-4 bg-green-200">{o.nama_pohon}</td>
                                                            <td className="border-r border-b border-emerald-500 px-6 py-4 max-w-[150px]">
                                                                <div className="flex flex-col justify-center items-center gap-2">
                                                                    <ButtonSkyBorder
                                                                        className="w-full"
                                                                    >
                                                                        <TbPencil className="mr-1" />
                                                                        Edit
                                                                    </ButtonSkyBorder>
                                                                    <ButtonBlackBorder className="w-full"
                                                                        onClick={() => {
                                                                            AlertQuestion("Hapus?", "Hapus Renaksi OPD yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                                if (result.isConfirmed) {

                                                                                }
                                                                            });
                                                                        }}
                                                                    >
                                                                        <TbCheckbox className="mr-1" />
                                                                        Pilih
                                                                    </ButtonBlackBorder>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </React.Fragment>
                                        ))
                                    }
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                }
            </table>
        </div>
    )
}