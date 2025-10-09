import React from 'react';
import { AiToolsData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className='px-4 sm:px-20 xl:px-32 my-24'>
      <div className='text-center'>
        <h2 className='text-slate-700 text-[42px] font-semibold'>Powerful AI Tools</h2>
        <p className='text-gray-500 max-w-lg mx-auto'>
          Everything you need to create, enhance, and optimize your content with cutting-edge AI technology.
        </p>
      </div>

      <div className='flex flex-wrap mt-10 justify-center'>
        {AiToolsData.map((tool, index) => (
          <motion.div
            key={index}
            className='p-8 m-4 max-w-xs rounded-lg bg-[#FDFDFE] shadow-lg border-gray-100 
                       hover:-translate-y-1 transition-all duration-300 cursor-pointer'
            onClick={() => user && navigate(tool.path)}
            initial={{ rotate: 0, opacity: 0, scale: 0.9 }}
            whileInView={{ rotate: 360, opacity: 1, scale: 1 }}
            whileHover={{ rotate: 360, scale: 1.05 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            viewport={{ once: true }}
          >
            <motion.div
              className='w-12 h-12 p-3 text-white rounded-xl flex items-center justify-center'
              style={{
                background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
              }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <tool.Icon className='w-8 h-8' />
            </motion.div>

            <h3 className='mt-6 mb-3 text-lg font-semibold'>{tool.title}</h3>
            <p className='text-gray-400 text-sm max-w-[95%]'>{tool.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AiTools;

