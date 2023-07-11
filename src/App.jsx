import { useState } from 'react';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Searchbar from './components/Searchbar';
import Loader from './components/Loader';
import { useQuery } from '@tanstack/react-query';

function App() {
	const [user, setUser] = useState({
		username: ''
	});

	const [input, setInput] = useState('octocat');
	const [theme, setTheme] = useState(true);

	function handleUser(event) {
		const { name, value } = event.target;
		// console.log(value);
		setUser((prevUser) => {
			return {
				...prevUser,
				[name]: value
			};
		});
	}

	const getUserProfile = async (profileInput) => {
		const res = await fetch(`https://api.github.com/users/${profileInput}`);
		const data = await res.json();
		if (res.status === 404) {
			console.log(res.status);
			console.log(data);
			return;
		} else {
			console.log(data);
			return data;
		}
	};

	const {
		data: github,
		isLoading,
		error
	} = useQuery({
		queryKey: ['githubUser', input],
		queryFn: () => getUserProfile(input),
		refetchOnMount: true,
		keepPreviousData: true,
		enabled: !!input,
		refetchOnWindowFocus: false
	});

	function handleClick(event) {
		event.preventDefault();
		console.log(user);
		setInput(user.username);
	}
	function toggleTheme() {
		setTheme((prevTheme) => !prevTheme);
	}
	// github && console.log(github);
	return (
		<div
			className={`${
				theme ? 'bg-dark-navy-blue' : 'bg-whitish-blue'
			} w-full min-h-screen flex flex-col justify-center items-center py-20`}
		>
			{isLoading ? (
				<Loader dark={theme} />
			) : (
				<>
					<div className="w-11/12 xs:w-5/6 sm:w-110 600:w-100 lg:w-120 ">
						<Navbar onClick={toggleTheme} dark={theme} />
					</div>
					<div className="xs:w-5/6 w-11/12 sm:w-110 600:w-100 lg:w-120 ">
						<Searchbar
							onChange={handleUser}
							user={user.username}
							onClick={handleClick}
							error={error}
							dark={theme}
						/>
					</div>
					{github && (
						<div className="xs:w-5/6 w-11/12 600:w-100 sm:w-110 lg:w-120 ">
							<Profile
								input={input}
								user={user.username}
								profile={github}
								dark={theme}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default App;
