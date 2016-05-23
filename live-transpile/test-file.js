class IMATest {
	constructor() {
		this.hello = {
			en: 'hello',
			es: 'hola'
		};
	}

	sayHello() {
		const {en, es} = this.hello;
		console.log(en);
		console.log(es);
	}
}