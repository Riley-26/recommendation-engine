import {FC, useContext} from 'react'
import {ThemeContext} from "../App";
import { useNavigate } from 'react-router-dom'
import { signUp, signIn, type SignInInput, confirmSignUp, type ConfirmSignUpInput } from 'aws-amplify/auth';

const Login:FC = () => {

	const navigate = useNavigate();
	const loggedContext:any = useContext(ThemeContext)!;
	const errorMessages:any = {
		"UserNotFoundException": "User not found. Please sign up or try again.",
		"UsernameExistsException": "User already exists. Please log in.",
		"CodeMismatchException": "Code invalid. Please try again."
	}
	
	const buttonClicked = (value:string) => {
		document.getElementById("form")?.addEventListener("submit", (data) => getData(data, value));
		
	}

	const getData = async (data:any, value:string) => {
		const userUsername:string = data.target.getElementsByTagName("input")[0].value
		const userEmail:string = data.target.getElementsByTagName("input")[1].value
		const userPassword:string = data.target.getElementsByTagName("input")[2].value

		if (value === "login"){
			login({username: userUsername, password: userPassword})
		} else if (value === "signup") {
			if (!userEmail){
				alert("Please provide an email if signing up.")
				window.location.reload()
			} else{
				handleSignUp({username: userUsername, email: userEmail, password: userPassword})
			}
		}

		data.preventDefault()
	}

	const login = async ({username, password}: SignInInput) => {
		try {
			await signIn({ username, password });
			loggedContext.updateState(true);
			window.location.href = "/"
		} catch (error:any) {
			console.log(error)
			let errorMessage:string = `${error}`;
			errorMessage = errorMessage.split(":")[0];
			if (errorMessage in errorMessages){
				alert(errorMessages[errorMessage])
				window.location.reload()
			}
		}
	}

	type SignUpParams = {
		username: string,
		password: string,
		email: string,
	}

	const handleSignUp = async ({username, password, email}: SignUpParams) => {
		try {
			const { isSignUpComplete, userId, nextStep } = await signUp({
				username,
				password,
				options: {
					userAttributes: {
						email
					},
					autoSignIn: true
				}
			});
			console.log("Signed Up")
			login({username: username, password: password})
			let code:any = prompt("Please enter your verification code:", "")
			console.log(code)
			handleConfirm({username: username, confirmationCode: code})
			//window.location.href = "/"
		} catch (error:any) {
			console.log(error)
			let errorMessage:string = `${error}`;
			errorMessage = errorMessage.split(":")[0];
			if (errorMessage in errorMessages){
				alert(errorMessages[errorMessage])
				window.location.reload()
			}
		}
	}

	const handleConfirm = async ({ username, confirmationCode }: ConfirmSignUpInput) => {
		try {
			const { isSignUpComplete, nextStep } = await confirmSignUp({
				username,
				confirmationCode
			});
		} catch (error) {
			console.log(error)
			let errorMessage:string = `${error}`;
			errorMessage = errorMessage.split(":")[0];
			if (errorMessage in errorMessages){
				alert(errorMessages[errorMessage])
				window.location.href = "/login"
			}
		}
	}

	return (
		<div className='flex flex-col items-center justify-center max-w-6xl mx-auto min-h-screen'>
			<span id="loginLogo" className='cursor-pointer'>REC<span className="text-indigo-200" onClick={() => navigate("/")}>MEND</span></span>
			<form id="form" className='flex flex-col w-4/5 border-2 border-indigo-200 rounded-lg my-6 p-4 sm:p-20'>
				<div className='flex flex-col my-6'>
					<label className='text-lg my-2'>Username*</label>
					<input required className="text-md sm:text-lg border-2 border-indigo-200 border-opacity-60 rounded-lg bg-gray-800 p-2 transition-all focus-within:border-opacity-100"/>
				</div>
				<div className='flex flex-col my-6'>
					<label className='text-lg my-2'>Email</label>
					<input  className="text-md sm:text-lg border-2 border-indigo-200 border-opacity-60 rounded-lg bg-gray-800 p-2 transition-all focus-within:border-opacity-100" type='email'/>
				</div>
				<div className='flex flex-col my-6'>
					<label className='text-lg my-2'>Password*</label>
					<input required className="text-md sm:text-lg border-2 border-indigo-200 border-opacity-60 rounded-lg bg-gray-800 p-2 transition-all focus-within:border-opacity-100" type='password'/>
				</div>
				<div className='flex flex-col justify-center md:flex-row'>
					<button type='submit' onClick={() => {buttonClicked("login"); return(false)}} className="mx-auto w-2/4 md:w-1/4 lg:px-6 my-4 px-4 py-4 bg-indigo-200 border-2 border-indigo-200 rounded-lg text-gray-800 font-bold text-xl transition-all hover:bg-gray-800 hover:text-gray-50">
						Log In
					</button>
					<button type='submit' onClick={() => {buttonClicked("signup"); return(false)}} className="mx-auto w-2/4 md:w-1/4 lg:px-6 my-4 px-4 py-4 bg-indigo-200 border-2 border-indigo-200 rounded-lg text-gray-800 font-bold text-xl transition-all hover:bg-gray-800 hover:text-gray-50">
						Sign Up
					</button>
				</div>
			</form>
		</div>
	)
}

export default Login;