type Props = {

};

export default function Login (props: Props) {
 return (
  <div className='absolute bottom-0 right-0 translate-y-full rounded drop-shadow-2xl min-w-[20rem]'>
    <div className='relative grid flex-col p-4 mt-1 gap-2'>
      <div className='absolute inset-0 w-full bg-gradient-to-r from-primary-dark via-primary-lighter to-primary-dark opacity-50 rounded -z-10' />
      <div className='flex flex-col'>
        <label htmlFor='email' className='text-xs text-gray-400 font-bold'>
          Email
        </label>
        <input id='email' className='rounded-sm border-gray-300 border-2 border-solid text-black text-sm focus-visible:outline-0' />
      </div>
      <div className='flex flex-col'>
        <label htmlFor='password' className='text-xs text-gray-400 font-bold'>
          Password
        </label>
        <input type='password' id='password' className='rounded-sm border-gray-300 border-2 border-solid text-black text-sm focus-visible:outline-0' />
      </div>
      <button className='w-100 bg-secondary-light text-gray-700 rounded-sm min-h-[2rem] hover:bg-secondary-dark hover:text-white duration-300 text-sm mt-2'>
        Login
      </button>
      <div className='text-[0.6rem] text-gray-300 text-center'>
        Don’t have an account? <span className='font-bold text-white cursor-pointer hover:text-gray-200 duration-300'>Register an Account</span>
      </div>
    </div>
  </div>
 );
};