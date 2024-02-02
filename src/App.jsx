import { useState } from 'react';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Searchbar from './components/Searchbar';
import Loader from './components/Loader';
import { useQuery } from '@tanstack/react-query';

// function to dynamically fetch github user API
const getUserProfile = async (profileInput) => {
	try {
		const res = await fetch(`https://api.github.com/users/${profileInput}`);
		const data = await res.json();

		if (!res.ok) {
			// Handle non-successful responses generically or throw an error
			throw new Error(`Error: ${res.status} - ${data.message}`);
		}
		return data;
	} catch (err) {
		console.error('Failed to fetch user profile:', err);
	}
};

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

	const {
		data: github,
		isLoading,
		error
	} = useQuery({
		queryKey: ['githubUser', input], // just like key in localstorage, you can check in ReactQueryDevtools
		queryFn: () => getUserProfile(input), // function to request and render the data
		refetchOnMount: true, //  This helps in keeping the data displayed to the user up-to-date.
		// keepPreviousData: true,
		enabled: !!input, // if input is empty, then don't make a request, otherwise, make a request
		refetchOnWindowFocus: false, // Data is not going to be re-fetched when any interaction takes place within the window
		staleTime: 60000
	});

	// handleClick function will be invoked in Searchbar.jsx
	function handleClick(event) {
		event.preventDefault();
		console.log(user);
		setInput(user.username);
		setUser((prevUser) => ({
			...prevUser,
			username: ''
		}));
	}
	function toggleTheme() {
		setTheme((prevTheme) => !prevTheme);
	}

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
