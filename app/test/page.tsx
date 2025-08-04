'use client';

import React from 'react'
import axios from 'axios'
import { useState } from 'react'


type products={
    title:string,
    price:number,
    description:string,
}

const page = () => {

        const [data,setdata]=useState<products[]>([]);
        const [loading, setLoading] = useState(false);


        // eikhane ami amar data fetch korbo 

        const fetchdatas=async (cat:string)=>{
            setLoading(true);

            try {
                const response= await axios.get(`https://fakestoreapiserver.reactbd.org/api/${cat}`);
                setdata(response.data.data);
                
            }

            catch (error){
                console.log('Error fetching datda:',error);
                setdata([]);

            }
            finally {
                setLoading(false);
            }
        }



  return (
    <div>

        <h1>these are my shop products</h1>
        <button onClick={()=>fetchdatas('products')}>Fetch Products</button>
        { loading ? <p>Loading .....</p>
        : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            
            {data.map((product,i)=>(
                <div key={i}  className='border p-4 rounded shadow-md m-4'>
                    <div className='product-card '>
                        <h2 className='text-lg font-semibold'>{product.title}</h2>
                        <p className='text-gray-600 font-semibold'>Price: ${product.price}</p>
                        <p>Description: {product.description}</p>
                    </div>
                </div>
            ))}
            
            
            </div>}





    </div>
  )
}

export default page