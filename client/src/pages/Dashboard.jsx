// import React, { useEffect, useState } from 'react'
// import { dummyCreationData } from '../assets/assets';
// import { Gem, Sparkles } from 'lucide-react';
// import { Protect, useAuth } from '@clerk/clerk-react';
// import CreationItem from '../components/CreationItem';
// import axios from 'axios'
// import toast from 'react-hot-toast';

// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// const Dashboard = () => {

//   const [creation, setCreation] = useState([]);

//   const [loading, setLoading] = useState(false)
//   const {getToken} = useAuth()

//   const getDashboardData = async () => {
//     try {
//       const token = await getToken();           // ✅ Get the token
//       const { data } = await axios.get('/api/user/get-user-creation',{
//         headers: {
//         Authorization: `Bearer ${token}`,     // ✅ Send token
//         },
//       })

//       if ( data.success) {
//         setCreation(data.creation)
//       } else {
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//     setLoading(false)
//   }

//   useEffect(() => {
//     getDashboardData();
//   }, []);

//   return (
//     <div className='h-full overflow-y-scroll p-6'>
//       <div className='flex justify-start gap-4 flex-wrap'>
//         {/* Total Creations Card */}
//         <div className='flex justify-between items-center w-72 p-4 px-6 bg-white
//         rounded-xl border border-gray-200'>
//           <div className='text-slate-600'>
//             <p className='text-sm'>Total Creations</p>
//             <h2 className='text-xl font-semibold'>{creation.length}</h2>
//           </div>
//           <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2]
//           to-[#0BB0D7] text-white flex justify-center items-center'>
//             <Sparkles className='w-5 text-white'/>
//           </div>
//         </div>
//         {/* Active Plan Card */}
//         <div className='flex justify-between items-center w-72 p-4 px-6 bg-white
//         rounded-xl border border-gray-200'>
//           <div className='text-slate-600'>
//             <p className='text-sm'>Active Plan</p>
//             <h2 className='text-xl font-semibold'>
//               <Protect plan='premium' fallback='Free'>Premium</Protect>
//             </h2>
//           </div>
//           <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5]
//           to-[#9E53EE] text-white flex justify-center items-center'>
//             <Gem className='w-5 text-white'/>
//           </div>
//         </div>
//         </div>

//       {
//         loading ? (
//             <div className='flex justify-center items-center h-3/4'>
//               <div className='animate-spin rounded-full h-11 w-11 border-4
//               border-purple-500 border-t-transparent'></div>
//             </div>
//         ) : (
//           <div className='space-y-3'>
//           <p className='mt-6 mb-4'>Recent Creations</p>
//            {
//             creation.map((item)=> <CreationItem key={item.id} item={item}/>)
//            }
//           </div>
//         )
//       }
//     </div>
//   )
// }

// export default Dashboard


import React, { useEffect, useState } from "react";
import { Gem, Sparkles } from "lucide-react";
import { Protect, useAuth } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creation, setCreation] = useState([]);
  const [loading, setLoading] = useState(false);

  // 👉 pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [creationsPerPage] = useState(10); // show 5 per page

  const { getToken } = useAuth();

  const getDashboardData = async () => {
    setLoading(true);
    try {
      const token = await getToken(); // ✅ Get the token
      const { data } = await axios.get("/api/user/get-user-creation", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token
        },
      });

      if (data.success) {
        setCreation(data.creation);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  // 👉 pagination logic
  const indexOfLastCreation = currentPage * creationsPerPage;
  const indexOfFirstCreation = indexOfLastCreation - creationsPerPage;
  const currentCreations = creation.slice(
    indexOfFirstCreation,
    indexOfLastCreation
  );

  const totalPages = Math.ceil(creation.length / creationsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="h-full overflow-y-scroll p-6">
      {/* ==== Top Cards ==== */}
      <div className="flex justify-start gap-4 flex-wrap">
        {/* Total Creations Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creation.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
            </h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

      {/* ==== List of Creations ==== */}
      {loading ? (
        <div className="flex justify-center items-center h-3/4">
          <div className="animate-spin rounded-full h-11 w-11 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="mt-6 mb-4">Recent Creations</p>

          {currentCreations.map((item) => (
            <CreationItem key={item.id} item={item} />
          ))}

          {/* ==== Pagination Controls ==== */}
          {creation.length > creationsPerPage && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                Prev
              </button>

              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

