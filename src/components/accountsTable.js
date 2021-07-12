import { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function AccountTable({ accountsData }) {
	const divStyle = {
		paddingTop: '8rem',
	};
	return (
		<Container fluid style={divStyle}>
			<Row className="align-items-center">
				<Col>
					<Table striped bordered hover variant="dark">
						<thead>
						<tr>
							<th>Account ID</th>
							<th>Account Name</th>
							<th>Account Number</th>
							<th>Account Type</th>
						</tr>
						</thead>
						<tbody>
						{accountsData && accountsData.map(( account, index ) => {
							return (
								<tr key={index}>
								<td>{account.id}</td>
								<td>{account.name}</td>
								<td>{account.number}</td>
								<td>{account.type}</td>
								</tr>
							);
						})}
						</tbody>
					</Table>
				</Col>
			</Row>
		</Container>
	);
}

class AccountsTableComponent extends Component {
	constructor() {
		super();

		this.state = {
			data: null,
			loading: true,
			showError: false,
			error: null,
		};
	}

	componentDidUpdate() {
	}

	componentDidMount() {
		this.executeQuery();
	}

	executeQuery = () => {
		if (!process.env.hasOwnProperty('REACT_APP_DBASVCSAPI_URL')) {
			console.error('missing dbasvcsapi url environment variable');
			this.setState({ error: 'missing dbasvcsapi url environment variable' });
			return;
		}
		if (!process.env.hasOwnProperty('REACT_APP_DBASVCSAPIAPI_KEY')) {
			console.error('missing dbasvcsapi key environment variable');
			this.setState({ error: 'missing dbasvcsapi key environment variable' });
			return;
		}
		const requestOptions = {
			method: 'GET',
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			headers: { 'Content-Type': 'application/json', 'X-Auth-Token': process.env['REACT_APP_DBASVCSAPIAPI_KEY'] },
			redirect: 'follow', // manual, *follow, error
			referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		};

		fetch(process.env['REACT_APP_DBASVCSAPI_URL'], requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error(`Network response was not ok: ${response.blob()}`);
				}
				return response.json()
			})
			.then(data => {
				if (!data || (data && data.length === 0)) {
					console.log("returning no data")
					this.setState({ error: 'no accounts found' });
					return;
				}
		
				this.setState({ 
					loading: false,
					data: data,
					error: null,
				});
			})
			.catch(error => {
				console.log(`failed to get accounts: ${error}`);
				this.setState({ error: error.message });
				return;
			});
	}

	toggleShowError = () => this.setState({ showError: !this.state.showError });

	disableShowError = () => this.setState({ showError: false });

	render() {

		if (this.state.error || this.state.loading) {
			return (
				<div className="accountsTable">
					<main className="main"> 
						<div className="pt-5">
							<ToastContainer className="pt-5" position="top-end">
								<Toast delay={3000} autohide>
								<Toast.Header>
									<strong className="me-auto">Bootstrap</strong>
									<small>1 sec ago</small>
								</Toast.Header>
								<Toast.Body>Accounts get failed: {this.state.error}</Toast.Body>
								</Toast>
							</ToastContainer>
						</div>
					</main>
				</div>
			)
		}

		return (
			<div className="container">
				<main className="main"> 
					<AccountTable accountsData={this.state.data}></AccountTable>
				</main>
			</div>
		);
	  }
}

export default AccountsTableComponent;