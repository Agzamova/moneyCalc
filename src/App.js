import React, { Component } from 'react';
import Total from './components/Total';
import History from './components/History';
import Operation from './components/Operation';

class App extends Component {

	state = {
		transactions: JSON.parse(localStorage.getItem('calc')) || [],
		descr: '',
		amount: '',
		resultIncome: 0,
		resultExpenses: 0,
		totalBalance: 0,
	}

	componentWillMount() {
		this.getTotalBalance()
	}

	componentWillUpdate() {
		this.addLocalStorage()
	}

	addTransaction = (add) => {

		const transactions = [...this.state.transactions] // 

		const transaction = {
			id: `cmr${(+new Date()).toString(16)}`,
			descr: this.state.descr,
			amount: parseFloat(this.state.amount),
			add
		}

		transactions.push(transaction)

		this.setState({
			transactions,
			descr: '',
			amount: '',
		}, this.getTotalBalance)
	}

	addDescr = (e) => { // это метод, поэтому без const
		this.setState({
			descr: e.target.value
		})
	}

	addAmount = (e) => {
		this.setState({ // ассинхронная функция
			amount: e.target.value
		}, () => {console.log(this.state)}) // коллбек функция, которую надо выполнить когда state обновится
	}

	getIncome = () => this.state.transactions
			.filter(item => item.add)
			.reduce((acc, item) => item.amount + acc, 0)
			// .reduce((acc, item) => item.add ? item.amount + acc : acc, 0)

	getExpenses = () => this.state.transactions
			.filter(item => !item.add)
			.reduce((acc, item) => item.amount + acc, 0)
			// .reduce((acc, item) => !item.add ? item.amount + acc : acc, 0)

	getTotalBalance = () => {
		const resultIncome = this.getIncome()
		const resultExpenses = this.getExpenses()

		const totalBalance = resultIncome - resultExpenses

		this.setState({
			resultIncome,
			resultExpenses,
			totalBalance,
		})
	}

	addLocalStorage() {
		localStorage.setItem('calc', JSON.stringify(this.state.transactions))
	}

	delTransaction = (key) => {
		const transactions = this.state.transactions.filter(item => item.id !== key)
		this.setState({transactions}, this.getTotalBalance)
	}
	
	render() {
		return (
			<>
				<header>
					<h1>Кошелек</h1>
					<h2>Калькулятор расходов</h2>
				</header>

				<main>
					<div className="container">
						<Total 
							resultIncome={this.state.resultIncome}
							resultExpenses={this.state.resultExpenses}
							totalBalance={this.state.totalBalance}
						/>
						<History 
							transactions={this.state.transactions}
							delTransaction={this.delTransaction}/>
						<Operation 
							addTransaction={this.addTransaction}
							addAmount={this.addAmount}
							addDescr={this.addDescr}
							descr={this.state.descr}
							amount={this.state.amount}
						/>
					</div>
				</main>
			</>
		);
	}
}

export default App;