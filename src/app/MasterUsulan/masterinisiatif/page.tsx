import Table from "@/components/pages/masterusulan/inisiatif/Table";
import { ButtonSky } from "@/components/global/Button";
import { FiHome } from "react-icons/fi";
import { TbCirclePlus } from "react-icons/tb";

const masterinisiatif = () => {
    return(
       <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan OPD</p>
                <p className="mr-1">/ Master Usulan Inisiatif</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-wrap items-end">
                        <h1 className="uppercase font-bold">Master Usulan Inisiatif</h1>
                    </div>
                    <div className="flex flex-col">
                        <ButtonSky 
                            className="flex items-center justify-center"
                            halaman_url='/tematikkota/tambah'
                        >
                            <TbCirclePlus className="mr-1"/>
                            Tambah Inisiatif
                        </ButtonSky>
                    </div>
                </div>
                <Table />
            </div>
       </>
    )
}

export default masterinisiatif;