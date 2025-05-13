'use client'

import { ButtonGreen, ButtonGreenBorder, ButtonRed, ButtonRedBorder, ButtonSky, ButtonSkyBorder } from "@/components/global/Button";
import { useState, useEffect } from "react";
import { TbCirclePlus, TbArrowBadgeDownFilled, TbPencil, TbPencilDown, TbTrash } from "react-icons/tb";
import { ModalRenaksiOpd } from "./ModalRenaksiOpd";
import { AlertQuestion } from "@/components/global/Alert";

interface Table {
    kode_opd: string;
    tahun: string;
}

export const Table: React.FC<Table> = ({ kode_opd, tahun }) => {

    const [ModalTambah, setModaltambah] = useState<boolean>(false);
    const [ModalEdit, setModalEdit] = useState<boolean>(false);

    const [IdRekin, setIdRekin] = useState<string>('');
    const [IdRenaksi, setIdRenaksi] = useState<string>('');
    const [Rekin, setRekin] = useState<string>('');

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const handleModalTambah = (id: string, rekin: string) => {
        if (ModalTambah) {
            setModaltambah(false);
            setRekin('');
            setIdRekin('');
        } else {
            setModaltambah(true);
            setIdRekin(id);
            setRekin(rekin);
        }
    }
    const handleModalEdit = (id: string, id_renaksi: string, rekin: string) => {
        if (ModalEdit) {
            setModalEdit(false);
            setRekin('');
            setIdRekin('');
            setIdRenaksi('');
        } else {
            setModalEdit(true);
            setRekin(rekin);
            setIdRekin(id);
            setIdRenaksi(id_renaksi);
        }
    }

    return (
        <div className="overflow-auto m-2 rounded-t-xl border">
            <table className="w-full">
                <thead>
                    <tr className="bg-emerald-500 text-white">
                        <th rowSpan={2} className="border-r border-b px-3 py-3 min-w-[50px] text-center">No</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Rencana Kinerja</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Indikator Rencana Kinerja</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Target</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Satuan</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Aksi/Kegiatan</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Sub Kegiatan</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Anggaran</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Pemilik</th>
                        <th colSpan={3} className="border-r border-b px-6 py-3 min-w-[150px]">Jadwal Pelaksanaan</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Keterangan</th>
                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                    </tr>
                    <tr className="bg-emerald-500 text-white">
                        <th className="border-r border-b px-6 py-3 min-w-[100px]">TW1</th>
                        <th className="border-r border-b px-6 py-3 min-w-[100px]">TW2</th>
                        <th className="border-r border-b px-6 py-3 min-w-[100px]">TW3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td rowSpan={3} className="border-r border-b px-3 py-4 text-center">1</td>
                        <td rowSpan={3} className="border-r border-b px-6 py-4">
                            <div className="flex flex-col justify-center gap-3">
                                <h1 className="border-b border-emerald-500">Rencana Kinerja</h1>
                                <button
                                    onClick={() => handleModalTambah('id', 'rencana kinerja opd')}
                                    className="flex justify-between items-center gap-1 rounded-full p-1 bg-sky-500 text-white border border-sky-500 hover:bg-white hover:text-sky-500 hover:border hover:border-sky-500"
                                >
                                    <div className="flex items-center gap-1">
                                        <TbCirclePlus className="text-lg" />
                                        <p className="text-xs">Tambah Renaksi</p>
                                    </div>
                                    <TbArrowBadgeDownFilled className="-rotate-90" />
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td rowSpan={0} className="border-r border-b px-6 py-4">Indikator Rekin</td>
                        <td rowSpan={0} className="border-r border-b px-6 py-4">target</td>
                        <td rowSpan={0} className="border-r border-b px-6 py-4">satuan</td>
                        <td className="border-r border-b px-6 py-4">renaksi asn</td>
                        <td className="border-r border-b px-6 py-4">sub kegiatan</td>
                        <td className="border-r border-b px-6 py-4">Rp.10.000.000</td>
                        <td className="border-r border-b px-6 py-4">Pemilik</td>
                        <td className="border-r border-b px-6 py-4 text-center">12</td>
                        <td className="border-r border-b px-6 py-4 text-center">34</td>
                        <td className="border-r border-b px-6 py-4 text-center">14</td>
                        <td className="border-r border-b px-6 py-4">Keterangan</td>
                        <td className="border-r border-b px-6 py-4">
                            <div className="flex flex-col justify-center items-center gap-2">
                                <ButtonGreen
                                    className="w-full"
                                    onClick={() => handleModalEdit('', '', '')}
                                >
                                    <TbPencil className="mr-1" />
                                    Edit
                                </ButtonGreen>
                                <ButtonRed className="w-full"
                                    onClick={() => {
                                        AlertQuestion("Hapus?", "Hapus Renaksi OPD yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                            if (result.isConfirmed) {
                                                
                                            }
                                        });
                                    }}
                                >
                                    <TbTrash className="mr-1" />
                                    Hapus
                                </ButtonRed>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <ModalRenaksiOpd
                metode="baru"
                isOpen={ModalTambah}
                onClose={() => handleModalTambah('', '')}
                kode_opd={kode_opd}
                tahun={tahun}
                id_rekin={IdRekin}
                rekin={Rekin}
                indikator={[]}
                onSuccess={() => setFetchTrigger((prev) => !prev)}
            />
            <ModalRenaksiOpd
                metode="lama"
                isOpen={ModalEdit}
                onClose={() => handleModalEdit('', '', '')}
                id={IdRenaksi}
                kode_opd={kode_opd}
                tahun={tahun}
                id_rekin={IdRekin}
                rekin={Rekin}
                indikator={[]}
                onSuccess={() => setFetchTrigger((prev) => !prev)}
            />
        </div>
    )
}