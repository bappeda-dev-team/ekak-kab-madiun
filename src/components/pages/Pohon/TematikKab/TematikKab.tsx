'use client'

import { getOpdTahun, getToken } from '@/components/lib/Cookie';
import { useState, useEffect } from 'react';
import Select from 'react-select'
import PohonTematik from './PohonTematik';
import { TahunNull } from '@/components/global/OpdTahunNull';
import { useRouter, useSearchParams } from 'next/navigation';
import { ButtonBlackBorder, ButtonSky } from '@/components/global/Button';
import { TbEye, TbPrinter } from 'react-icons/tb';

interface OptionType {
    value: number;
    label: string;
}

const TematikKab = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [Tahun, setTahun] = useState<any>(null);
    const [TematikOption, setTematikOption] = useState<OptionType[]>([]);
    const [Tematik, setTematik] = useState<OptionType | null>(null);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const token = getToken();

    // SHOW ALL
    const [ShowAll, setShowAll] = useState<boolean>(false);

    useEffect(() => {
        const data = getOpdTahun();
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if (data.opd) {
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, []);

    useEffect(() => {
        // Ambil parameter dari URL saat komponen dimuat
        const temaFromUrl = searchParams.get('tema');
        const idFromUrl = searchParams.get('id');

        if (temaFromUrl && idFromUrl) {
            // Set Tematik berdasarkan parameter URL jika ada
            setTematik({ label: temaFromUrl, value: Number(idFromUrl) });
        }
    }, [searchParams]);

    const fetchTematik = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/pohon_kinerja/tematik/${Tahun?.value}`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data opd');
            }
            const data = await response.json();
            const tema = data.data.map((item: any) => ({
                value: item.id,
                label: item.nama_pohon,
            }));
            setTematikOption(tema);
        } catch (err) {
            console.log('gagal mendapatkan data opd');
        } finally {
            setIsLoading(false);
        }
    };

    if (Tahun?.value == undefined) {
        return <TahunNull />
    }

    const handleSetTematik = (tema: any) => {
        if (!tema) {
            setTematik(null); // Jika tema dihapus, reset Tematik
            router.push(`/pohonkinerjapemda`);
            return;
        }
        setTematik(tema);
        router.push(`/pohonkinerjapemda?tema=${tema.label}&id=${tema.value}`);
    };

    return (
        <>
            <div className="flex flex-col p-5 border-2 rounded-xl mt-3">
                <div className="flex flex-col">
                    <label
                        className="uppercase text-xs font-bold mb-2"
                        htmlFor="tematik"
                    >
                        Tema :
                    </label>
                    <Select
                        isSearchable
                        isClearable
                        options={TematikOption}
                        isLoading={IsLoading}
                        onChange={(option) => {
                            handleSetTematik(option)
                            setShowAll(false);
                        }}
                        placeholder="Masukkan Tema"
                        value={
                            searchParams.get('tema') === undefined || !Tematik ?
                                { label: "Pilih Tematik", value: "" }
                                :
                                { label: Tematik?.label, value: Tematik?.value }
                        }
                        onMenuOpen={() => {
                            if (TematikOption.length == 0) {
                                fetchTematik();
                            }
                        }}
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderRadius: '8px',
                            })
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between p-5 border-2 rounded-t-xl mt-2">
                {!Tematik ?
                    <h1 className="font-semibold">Pilih Tematik terlebih dahulu</h1>
                :
                    <>
                        <ButtonBlackBorder onClick={() => setShowAll(true)}>
                            <TbEye className='mr-1' />
                            Tampilkan Semua Pohon
                        </ButtonBlackBorder>
                        <ButtonSky>
                            <TbPrinter className='mr-1' />
                            Cetak Pohon Kinerja
                        </ButtonSky>
                    </>
                }
            </div>
            {Tematik &&
                <PohonTematik
                    id={Tematik?.value}
                    show_all={ShowAll}
                    set_show_all={() => setShowAll(false)}
                />
            }
        </>
    )
}

export default TematikKab;