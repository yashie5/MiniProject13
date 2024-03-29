import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate hook
import { Button, Input, Card, Divider} from '@nextui-org/react';
import { github, google, twitterLogo} from '@assets/index';
import { isUserLoggedIn, signInWithGithub, signInWithGoogle, signInUser } from '@services/index';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await signInUser(form.email, form.password);
    navigate('/home');
  };

  const signInWithProvider = async (provider: 'google' | 'github') => {
    if (provider === 'google') {
        await signInWithGoogle();
        navigate('/home');
    } else {
        await signInWithGithub();
        navigate('/home');
    }
  }

  useEffect(() => {
    // Create a new async function
    const checkUser = async () => {
      // Check if user is already logged in
      const result = await isUserLoggedIn();
      if (result) {
        navigate('/home');
      }
    };
  
    // Call the async function
    checkUser();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-white"> 
      <Card shadow="sm" className="w-[400px] p-10">
        <div className="text-center">
          <img src={twitterLogo} alt="logo" className="w-14 mx-auto mb-2" />
          <h2 className="text-xl font-bold mb-6">Log In to Twitter</h2>
        </div>
        <Button radius="full" className="bg-transparent border flex items-center justify-center mb-4" onClick={() => signInWithProvider("google")}>
          <img src={google} alt="logo" className="logo mr-2 w-5 h-5"/>
          Sign in with Google
        </Button>
        <Button radius="full" className="bg-transparent border flex items-center justify-center mb-1" onClick={() => signInWithProvider("github")}>
          <img src={github} alt="logo" className="logo mr-2 w-5 h-5"/>
          Sign in with Github
        </Button>
        <div className="flex items-center justify-center pb-4">
          <Divider className="w-1/3 bg-gray-300 mr-2"/>
          <span className="text-gray-500">or</span>
          <Divider className="w-1/3 bg-gray-300 ml-2"/>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 pt-2">
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input 
              variant="underlined"
              type="email"
              placeholder="Phone, email, or username"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"> 
            <Input variant="underlined"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <Button radius="full" type="submit" className='bg-blue-500 hover:bg-blue-600 text-white'>Sign In</Button>
        </form>
        <div className="text-center mt-6 flex justify-between">
            <div className="text-blue-500 hover:underline">Forgot Password?</div>
            <div className="text-blue-500 hover:underline"><Link to="/signup">Sign Up</Link></div>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
