const filterCurrencies = ['dolar', 'euro', 'uf']


async function getCurrencies() {
    try {
        const res = await fetch("https://mindicador.cl/api/")
        const data = await res.json()
        const CurrencyList = filterCurrencies.map((currency) => {
            return {
                code: data[currency].codigo,
                value: data[currency].valor
            }
        })


        CurrencyList.forEach((localCurrency) => {
            const List = document.querySelector('#list_Currency')
            const option = document.createElement('option')
            option.value = localCurrency.value
            option.text = localCurrency.code
            List.append(option)
        })
    } catch (error) {
        alert("Ocurrio un error al obtener los datos")
        console.log("detalles de error " + error)
    }

}

const Calcular = () => {
    const List = document.querySelector('#list_Currency')
    valorDivisa = parseFloat(List.value)
    pesos = document.querySelector('#pesos_chilenos')
    if (pesos.value == "") {
        alert("Debe ingresar la cantidad a convertir")
    } else {
        const rst = document.querySelector('#result')
        result = (parseFloat(pesos.value) / valorDivisa)
        rst.innerHTML = `
                        Resultado:${result.toFixed(4)}
                        `
        DibujarGrafico(List[List.selectedIndex].text)
    }
}

const DibujarGrafico = async (currency) => {
    try {
        const ctx = document.querySelector('#grafico')
        const res = await fetch("https://mindicador.cl/api/" + currency)
        const datos = await res.json()
        const dias = datos.serie.slice(0, 10)
        console.log(dias)
        //comienzo del grafico
        const data = {
            labels: dias.map((item) => item.fecha.substring(0, 10)),
            datasets: [{
                label: currency,
                data: dias.map((item) => item.valor),
                fill: false,
                borderColor: 'rgb(0, 51, 0)',
                tension: 0.1
            }]
        }
    
        const config = {
            type: 'line',
            data: data,
        };
        const chart = new Chart(ctx, config)
    } catch (error) {
        alert("Ocurrio un error al dibujar el grafico")
        console.log("detalles de error " + error)
    }

};

//final del grafico


const btnCalcular = document.querySelector('#btnCalc')
btnCalcular.addEventListener('click', Calcular)



getCurrencies()