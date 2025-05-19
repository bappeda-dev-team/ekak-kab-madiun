'use client'

import { ButtonGreen, ButtonRed, ButtonSkyBorder } from "@/components/global/Button";
import React, { useState, useEffect } from "react";
import { TbCirclePlus, TbArrowBadgeDownFilled, TbPencil, TbPencilDown, TbTrash } from "react-icons/tb";
import { ModalRenaksiOpd } from "./ModalRenaksiOpd";
import { AlertQuestion } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip2 } from "@/components/global/Loading";

interface Table {
    kode_opd: string;
    tahun: number;
}
interface RekinAsn {
    kode_opd: string;
    tahun: number;
    token: string;
    id: number;
}

interface IndikatorSasaranOpd {
    id: string;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: {
        id: string;
        indikator_id: string;
        tahun: string;
        target: string;
        satuan: string;
    }
}

interface Sasaran {
    id: number;
    nama_sasaran_opd: string;
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    indikator: IndikatorSasaranOpd[];
}

interface SubKegiatan {
  kode_subkegiatan: string;
  nama_subkegiatan: string;
  indikator: {
    id: string;
    indikator: string;
    target: string;
    satuan: string;
  }[];
}

interface RencanaKinerja {
  rekin_id: string;
  nama_rencana_kinerja: string;
  nip_pegawai: string;
  nama_pegawai: string;
  kode_opd: string;
  total_anggaran: number;
  subkegiatan: SubKegiatan[];
}

interface Rekin {
  id_renaksiopd: number;
  sasaran_opd_id: number;
  nama_sasaran_opd: string;
  tahun_renaksi: string;
  tw1: number;
  tw2: number;
  tw3: number;
  tw4: number;
  keterangan: string | null;
  rencana_kinerja: RencanaKinerja[];
}

export const Table: React.FC<Table> = ({ kode_opd, tahun }) => {

    const [SasaranOpd, setSasaranOpd] = useState<Sasaran[]>([]);

    const [ModalTambah, setModaltambah] = useState<boolean>(false);
    const [ModalEdit, setModalEdit] = useState<boolean>(false);

    const [Loading, setLoading] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);

    const [IdRenaksi, setIdRenaksi] = useState<string>('');
    const [IdRekin, setIdRekin] = useState<string>('');
    const [IdSasaran, setIdSasaran] = useState<number>(0);
    const [IndikatorSasaran, setIndikatorSasaran] = useState<IndikatorSasaranOpd[]>([]);
    const [Rekin, setRekin] = useState<string>('');

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const API_URL_2 = process.env.NEXT_PUBLIC_API_URL_2;
        const fetchSasaran = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL_2}/sasaran_opd/all/${kode_opd}/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                // console.log(data);
                if (data == null) {
                    setDataNull(true);
                    setSasaranOpd([]);
                } else {
                    setDataNull(false);
                    setSasaranOpd(data);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchSasaran();
    }, [token, kode_opd, tahun, FetchTrigger]);

    const handleModalTambah = (id_sasaran: number, rekin: string, indikator: IndikatorSasaranOpd[]) => {
        if (ModalTambah) {
            setModaltambah(false);
            setRekin('');
            setIdSasaran(0);
            setIndikatorSasaran([]);
        } else {
            setModaltambah(true);
            setIdSasaran(id_sasaran);
            setRekin(rekin);
            setIndikatorSasaran(indikator);
        }
    }
    const handleModalEdit = (id: string, id_sasaran: string, id_rekin: string, rekin: string) => {
        if (ModalEdit) {
            setModalEdit(false);
            setRekin('');
            setIdRekin('');
            setIdRenaksi('');
        } else {
            setModalEdit(true);
            setRekin(rekin);
            setIdRekin(id_rekin);
            setIdRenaksi(id);
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
                {SasaranOpd.map((data: Sasaran, index: number) => (
                    <React.Fragment key={data.id || index}>
                        <tbody>
                            <tr>
                                <td rowSpan={data.indikator.length + 3} className="border-r border-b px-3 py-4 text-center">{index + 1}</td>
                                <td rowSpan={data.indikator.length + 3} className="border-r border-b px-6 py-4">
                                    <div className="flex flex-col justify-center gap-3">
                                        <h1 className="border-b border-emerald-500">{data.nama_sasaran_opd || "-"}</h1>
                                        <button
                                            onClick={() => handleModalTambah(data.id, data.nama_sasaran_opd, data.indikator)}
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
                            {data.indikator.map((i: IndikatorSasaranOpd, sub_index: number) => (
                                <React.Fragment key={i.id || sub_index}>
                                    <tr>
                                        <td rowSpan={2} className="border-r border-b px-6 py-4">{i.indikator || "-"}</td>
                                        <td rowSpan={2} className="border-r border-b px-6 py-4 text-center">{i.target.target || "-"}</td>
                                        <td rowSpan={2} className="border-r border-b px-6 py-4 text-center">{i.target.satuan || "-"}</td>
                                    </tr>
                                    <RekinAsn 
                                        tahun={tahun}
                                        kode_opd={kode_opd}
                                        token={token ? token : ''}
                                        id={data.id}
                                    />
                                </React.Fragment>
                            ))}
                        </tbody>
                    </React.Fragment>
                ))}
            </table>
            <ModalRenaksiOpd
                metode="baru"
                isOpen={ModalTambah}
                onClose={() => handleModalTambah(0, '', [])}
                kode_opd={kode_opd}
                tahun={String(tahun)}
                id_rekin={IdRekin}
                id_sasaran={IdSasaran}
                rekin={Rekin}
                indikator={IndikatorSasaran ? IndikatorSasaran : []}
                onSuccess={() => setFetchTrigger((prev) => !prev)}
            />
            <ModalRenaksiOpd
                metode="lama"
                isOpen={ModalEdit}
                onClose={() => handleModalEdit('', '', '', '')}
                id={IdRenaksi}
                kode_opd={kode_opd}
                tahun={String(tahun)}
                id_rekin={IdRekin}
                rekin={Rekin}
                indikator={[]}
                onSuccess={() => setFetchTrigger((prev) => !prev)}
            />
        </div>
    )
}

export const RekinAsn:React.FC<RekinAsn> = ({ id, tahun, token, kode_opd }) => {

    const [Rekin, setRekin] = useState<Rekin[]>([]);

    const [Loading, setLoading] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
 
    useEffect(() => {
        const API_URL_2 = process.env.NEXT_PUBLIC_API_URL_2;
        const fetchRekinById = async() => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL_2}/rencana-aksi-opd/${id}/${tahun}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                // console.log(data);
                if (data == null) {
                    setDataNull(true);
                    setRekin([]);
                } else {
                    setDataNull(false);
                    setRekin(data);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(true);
            }
        }
        fetchRekinById();
    }, [token, id, tahun]);

    if(Loading){
        return(
            <React.Fragment>
                <tr>
                    <td colSpan={9} className="border-r border-b px-6 py-4"><LoadingButtonClip2 /> Loading...</td>
                </tr>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            {Rekin.length != 0 ? 
                <tr>
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
                            <ButtonSkyBorder
                                className="w-full"
                            // onClick={() => handleModalEdit('', '', '')}
                            >
                                <TbPencil className="mr-1" />
                                Sync
                            </ButtonSkyBorder>
                            <ButtonGreen
                                className="w-full"
                            // onClick={() => handleModalEdit('', '', '')}
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
            :
                <tr>
                    <td colSpan={9} className="border-r border-b px-6 py-4 bg-red-300">data tidak ada</td>
                </tr>
            }
        </React.Fragment>
    )
} 