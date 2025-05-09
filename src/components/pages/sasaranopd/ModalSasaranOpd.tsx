'use client'

import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed, ButtonSkyBorder, ButtonRedBorder } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import Select from 'react-select';
import { AlertNotification } from "@/components/global/Alert";

interface OptionType {
    value: number;
    label: string;
}
interface OptionTypeString {
    value: string;
    label: string;
}

interface FormValue {
    id_pohon: OptionType;
    nama_rencana_kinerja: string;
    tahun: string;
    status_rencana_kinerja: string;
    catatan: string;
    tahun_awal: string,
    tahun_akhir: string,
    jenis_periode: string,
    kode_opd: string;
    pegawai_id: OptionTypeString;
    indikator: indikator[];
}

interface indikator {
    id?: string;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: target[];
}
type target = {
    id_target: string;
    id_indikator: string;
    target: string;
    satuan: string;
    tahun?: string;
};

interface modal {
    isOpen: boolean;
    onClose: () => void;
    metode: 'lama' | 'baru';
    kode_opd: string;
    id?: string;
    id_pohon?: number;
    tahun: number;
    tahun_awal: string;
    tahun_akhir: string;
    tahun_list: string[];
    pelaksana: OptionTypeString[];
    periode: number;
    jenis_periode: string;
    nama_pohon: string;
    onSuccess: () => void;
}

export const ModalSasaranOpd: React.FC<modal> = ({ isOpen, onClose, id, id_pohon, jenis_periode, kode_opd, pelaksana, tahun, tahun_akhir, tahun_awal, tahun_list, periode, nama_pohon, metode, onSuccess }) => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();

    const token = getToken();

    const [SasaranOpd, setSasaranOpd] = useState<string>('');
    const [Pelaksana, setPelaksana] = useState<OptionTypeString | null>(null);

    const [Proses, setProses] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

    const handleTambahIndikator = () => {
        const defaultTarget = Array((tahun_list && tahun_list.length)).fill({ target: '', satuan: '' }); // Buat array 5 target kosong
        append({ indikator: '', rumus_perhitungan: '', sumber_data: '', target: defaultTarget });
    };

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchDetailasaranOpd = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/sasaran_opd/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.data.rencana_kinerja[0];
                console.log(hasil);
                if (hasil.nama_rencana_kinerja) {
                    setSasaranOpd(hasil.nama_rencana_kinerja);
                }
                if (hasil.nip && hasil.nama_pegawai) {
                    const pelaksana = {
                        value: hasil.nip,
                        label: hasil.nama_pegawai,
                    }
                    setPelaksana(pelaksana);
                }
                reset({
                    indikator: hasil.indikator?.map((item: indikator) => ({
                        id: item.id,
                        indikator: item.indikator,
                        rumus_perhitungan: item.rumus_perhitungan,
                        sumber_data: item.sumber_data,
                        target: item.target.map((t: target) => ({
                            target: t.target,
                            satuan: t.satuan,
                        })),
                    })),
                });

                // Replace the fields to avoid duplication
                replace(hasil.indikator.map((item: indikator) => ({
                    id: item.id,
                    indikator: item.indikator,
                    rumus_perhitungan: item.rumus_perhitungan,
                    sumber_data: item.sumber_data,
                    target: item.target,
                })));
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        const fetchPokinBaru = async () => {
            try {
                const response = await fetch(`${API_URL}/pohon_kinerja/pokin_with_periode/${id_pohon}/${jenis_periode}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.data;
                // Mapping data ke form dengan struktur yang sesuai
                const indikatorData = hasil.indikator?.map((item: any) => ({
                    id: item.id, // Sesuai dengan struktur API
                    indikator: item.indikator,
                    rumus_perhitungan: item.rumus_perhitungan,
                    sumber_data: item.sumber_data,
                    target: item.target.map((t: any) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })) || [];

                reset({ indikator: indikatorData });

                // Mengisi array field di react-hook-form
                replace(indikatorData);
            } catch (err) {
                console.log(err);
            }
        };
        if (isOpen && metode === 'lama') {
            fetchDetailasaranOpd();
        } else if (isOpen && metode === 'baru') {
            fetchPokinBaru();
        }
    }, [token, isOpen, metode, tahun, id, replace, reset, id_pohon, jenis_periode]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formDataNew = {
            //key : value
            id_pohon: id_pohon,
            periode_id: periode,
            nama_rencana_kinerja: SasaranOpd,
            catatan: '',
            status_rencana_kinerja: '',
            tahun: String(tahun),
            tahun_awal: tahun_awal,
            tahun_akhir: tahun_akhir,
            jenis_periode: jenis_periode,
            kode_opd: kode_opd,
            pegawai_id: Pelaksana?.value,
            indikator: data.indikator.map((ind) => ({
                nama_indikator: ind.indikator,
                rumus_perhitungan: ind.rumus_perhitungan,
                sumber_data: ind.sumber_data,
                target: ind.target.map((t, index) => ({
                    target: t.target,
                    satuan: t.satuan,
                    tahun: tahun_list[index],
                })),
            })),
        };
        const formDataEdit = {
            //key : value
            id: id,
            id_pohon: id_pohon,
            periode_id: periode,
            nama_rencana_kinerja: SasaranOpd,
            catatan: '',
            status_rencana_kinerja: '',
            tahun: String(tahun),
            tahun_awal: tahun_awal,
            tahun_akhir: tahun_akhir,
            jenis_periode: jenis_periode,
            kode_opd: kode_opd,
            pegawai_id: Pelaksana?.value,
            indikator: data.indikator.map((ind) => ({
                id_indikator: ind.id,
                nama_indikator: ind.indikator,
                rumus_perhitungan: ind.rumus_perhitungan,
                sumber_data: ind.sumber_data,
                target: ind.target.map((t, index) => ({
                    target: t.target,
                    satuan: t.satuan,
                    tahun: tahun_list[index],
                })),
            })),
        };
        const getBody = () => {
            if (metode === "lama") return formDataEdit;
            if (metode === "baru") return formDataNew;
            return {}; // Default jika metode tidak sesuai
        };
        // metode === 'baru' && console.log("baru :", formDataNew);
        // metode === 'lama' && console.log("lama :", formDataEdit);
        if (Pelaksana?.value == null || Pelaksana?.value == undefined) {
            AlertNotification("", "Pilih 1 Pelaksana", "warning", 2000);
        } else if (SasaranOpd === '') {
            AlertNotification("", "Sasaran OPD wajib Terisi", "warning", 2000);
        } else {
            try {
                let url = "";
                if (metode === "lama") {
                    url = `sasaran_opd/update/${id}`;
                } else if (metode === "baru") {
                    url = `sasaran_opd/create`;
                } else {
                    url = '';
                }
                setProses(true);
                const response = await fetch(`${API_URL}/${url}`, {
                    method: metode === 'lama' ? "PUT" : "POST",
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(getBody()),
                });
                if (response.ok) {
                    AlertNotification("Berhasil", `Berhasil ${metode === 'baru' ? "Menambahkan" : "Mengubah"} Sasaran OPD`, "success", 1000);
                    onClose();
                    onSuccess();
                    reset();
                } else {
                    AlertNotification("Gagal", "terdapat kesalahan pada backend / database server dengan response !ok", "error", 2000);
                }
            } catch (err) {
                AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            } finally {
                setProses(false);
            }
        }
    };

    const handleClose = () => {
        onClose();
        setSasaranOpd('');
        setPelaksana(null);
        reset();
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">{metode === 'baru' ? "Tambah" : "Edit"} Sasaran OPD {id}</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                            >
                                Strategic OPD :
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{nama_pohon}</div>
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nama_rencana_kinerja"
                            >
                                Sasaran OPD:
                            </label>
                            <Controller
                                name="nama_rencana_kinerja"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_rencana_kinerja"
                                        placeholder="masukkan Sasaran OPD"
                                        value={SasaranOpd}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setSasaranOpd(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="pegawai_id"
                            >
                                Pelaksana :
                            </label>
                            <Controller
                                name="pegawai_id"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Pelaksana"
                                            options={pelaksana}
                                            isLoading={Loading}
                                            isSearchable
                                            isClearable
                                            value={Pelaksana}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setPelaksana(option);
                                            }}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                })
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <label className="uppercase text-base font-bold text-gray-700 my-2">
                            indikator Sasaran OPD :
                        </label>
                        {fields.map((field, index) => (
                            <React.Fragment key={index}>
                                <div className="flex flex-col border border-gray-300 my-2 py-2 px-2 rounded-lg">
                                    <Controller
                                        name={`indikator.${index}.indikator`}
                                        control={control}
                                        defaultValue={field.indikator}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Nama Indikator {index + 1} :
                                                </label>
                                                <input
                                                    {...field}
                                                    className="border px-4 py-2 rounded-lg"
                                                    placeholder={`Masukkan nama indikator ${index + 1}`}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                <div key={index} className="flex flex-col border border-gray-200 my-2 py-2 px-2 rounded-lg">
                                    <Controller
                                        name={`indikator.${index}.rumus_perhitungan`}
                                        control={control}
                                        defaultValue={field.rumus_perhitungan}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Rumus Perhitungan :
                                                </label>
                                                <input
                                                    {...field}
                                                    className="border px-4 py-2 rounded-lg"
                                                    placeholder={`Masukkan Rumus Perhitungan`}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                <div key={index} className="flex flex-col border border-gray-200 my-2 py-2 px-2 rounded-lg">
                                    <Controller
                                        name={`indikator.${index}.sumber_data`}
                                        control={control}
                                        defaultValue={field.sumber_data}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Sumber Data :
                                                </label>
                                                <input
                                                    {...field}
                                                    className="border px-4 py-2 rounded-lg"
                                                    placeholder={`Masukkan Sumber Data`}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-wrap justify-between gap-1">
                                    {field.target.map((_, subindex) => (
                                        <div key={`${index}-${subindex}`} className="flex flex-col py-1 px-3 border border-gray-200 rounded-lg">
                                            <label className="text-base text-center text-gray-700">
                                                <p>{tahun_list[subindex]}</p>
                                            </label>
                                            <Controller
                                                name={`indikator.${index}.target.${subindex}.target`}
                                                control={control}
                                                defaultValue={_.target}
                                                render={({ field }) => (
                                                    <div className="flex flex-col py-3">
                                                        <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                            Target :
                                                        </label>
                                                        <input
                                                            {...field}
                                                            type="text"
                                                            className="border px-4 py-2 rounded-lg"
                                                            placeholder="Masukkan target"
                                                        />
                                                    </div>
                                                )}
                                            />
                                            <Controller
                                                name={`indikator.${index}.target.${subindex}.satuan`}
                                                control={control}
                                                defaultValue={_.satuan}
                                                render={({ field }) => (
                                                    <div className="flex flex-col py-3">
                                                        <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                            Satuan :
                                                        </label>
                                                        <input
                                                            {...field}
                                                            className="border px-4 py-2 rounded-lg"
                                                            placeholder="Masukkan satuan"
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {index >= 0 && (
                                    <ButtonRedBorder
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="w-[200px] mt-3"
                                    >
                                        Hapus
                                    </ButtonRedBorder>
                                )}
                            </React.Fragment>
                        ))}
                        <ButtonSkyBorder
                            className="mb-3 mt-3"
                            type="button"
                            onClick={handleTambahIndikator}
                        >
                            Tambah Indikator
                        </ButtonSkyBorder>
                        <ButtonSky className="w-full mt-3" type="submit">
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span>
                                :
                                "Simpan"
                            }
                        </ButtonSky>
                        <ButtonRed className="w-full my-2" onClick={handleClose}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}