const filterCurrencies = ['dolar', 'euro', 'uf']


async function getCurrencies() {
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
    const ctx = document.querySelector('#grafico')
    ctx.innerHTML = ""
    const res = await fetch("https://mindicador.cl/api/" + currency)
    const datos = await res.json()
    const dias = datos.serie.slice(0, 10)
    console.log(dias)
    //comienzo del grafico
    const data = {
        labels: dias.map((item) => item.fecha.substring(0,10)),
        datasets: [{
            label: currency,
            data: dias.map((item) => item.valor),
            fill: false,
            borderColor: 'rgb(0, 51, 0)',
            tension: 0.1
        }]}

        const config = {
            type: 'line',
            data: data,
        };
        const chart = new Chart(ctx,config)
    };

    //final del grafico


const btnCalcular = document.querySelector('#btnCalc')
btnCalcular.addEventListener('click', Calcular)



getCurrencies()