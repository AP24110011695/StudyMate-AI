import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import UploadModal from "./components/UploadModal/UploadModal";

import Dashboard from "./pages/Dashboard/Dashboard";

function App() {

  const [open,setOpen]=useState(false);

const [pdfs, setPdfs] = useState(() => {
  const saved = localStorage.getItem("pdfs");

  return saved ? JSON.parse(saved) : [];
});

  const [search,setSearch]=useState("");

 function handleFile(file) {

  const newPdf = {
    id: Date.now(),
    name: file.name,
    size: (file.size / 1024 / 1024).toFixed(2),
    uploadedAt: new Date().toLocaleDateString(),
  };

  setPdfs((prev) => [newPdf, ...prev]);
}

  function deletePdf(index){

    setPdfs(prev=>prev.filter((_,i)=>i!==index));

  }
  useEffect(() => {
  localStorage.setItem("pdfs", JSON.stringify(pdfs));
}, [pdfs]);

  const filteredPdfs=pdfs.filter(pdf=>

    pdf.name.toLowerCase().includes(

      search.toLowerCase()

    )

  );

  return(

    <div className="app">

      <Sidebar/>

      <div className="content">

        <Navbar

          search={search}

          setSearch={setSearch}

        />

        <Dashboard
  pdfs={pdfs}
  filteredPdfs={filteredPdfs}
  onUpload={() => setOpen(true)}
  onDelete={deletePdf}
/>

      </div>

      <UploadModal

        open={open}

        onClose={()=>setOpen(false)}

        onFileSelect={handleFile}

      />

    </div>

  )

}

export default App;