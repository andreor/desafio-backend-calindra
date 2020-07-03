import { Client, Status } from "@googlemaps/google-maps-services-js";
import { geocode } from "@googlemaps/google-maps-services-js/dist/geocode/geocode";
import { distancematrix } from "@googlemaps/google-maps-services-js/dist/distance";


class EnderecoGeocoding {
    private lat: number;
    private lng: number;

    constructor(lat: number, lng: number) {
        this.lat = lat;
        this.lng = lng;
    }
};

class Retorno {
    private maisProximo: string;
    private maisDistante: string;

    constructor(maisProximo: string, maisDistante: string) {
        this.maisProximo = maisProximo;
        this.maisDistante = maisDistante;
    }
};


let enderecosGeocoding: EnderecoGeocoding[] = [];
// let enderecos: string[] = [
//     'Av. Rio Branco, 1 Centro, Rio de Janeiro RJ,20090 003',
//     'Praça Mal. Âncora, 122 Centro, Rio de Janeiro RJ, 20021 200',
//     'Rua 19 de Fevereiro, 34 Botafogo, Rio de Janeiro RJ, 22280 030'];




export class Distancias {


    public async verifyDistance(enderecos: string[]) {
        enderecosGeocoding = [];
        for (var i = 0, len = enderecos.length; i < len; i++) {

            const params: any = {
                address: enderecos[i],
                key: "AIzaSyDUlpUyScafudenSh6kucKXzaLUY9eJnbs"
            };

            const r = await geocode({ params: params });
            let enderecoGeocoding = new EnderecoGeocoding(r.data.results[0].geometry.location.lat, r.data.results[0].geometry.location.lng);
            enderecosGeocoding.push(enderecoGeocoding);


        }

        const params: any = {
            origins: [...enderecosGeocoding],
            destinations: [...enderecosGeocoding],
            key: "AIzaSyDUlpUyScafudenSh6kucKXzaLUY9eJnbs"
        };

        const r = await distancematrix({ params: params });
        const matrix = r.data.rows;

        let leastseconds: any = 86400; // 24 h para inicio
        let drivetime = "";
        let maisProximos: any;
        let maisDistantes: any;

        for (let j = 0; j < r.data.rows.length; j++) {

            let routes: any = r.data.rows[j].elements;


            for (let i = 0; i < routes.length; i++) {
                const routeseconds = routes[i].duration.value;
                if (routeseconds > 0 && routeseconds < leastseconds && r.data.origin_addresses[i] != r.data.destination_addresses[j]) {
                    leastseconds = routeseconds;
                    drivetime = routes[i].duration.text;
                    maisProximos = 'origem: ' + r.data.origin_addresses[i] + ' - destino: ' + r.data.destination_addresses[j];
                }

            }
            leastseconds = 86400; // 24 h para inicio
            drivetime = "";

            for (let i = 0; i < routes.length; i++) {
                const routeseconds = routes[i].duration.value;
                if (routeseconds > 0 && routeseconds < leastseconds && r.data.origin_addresses[i] != r.data.destination_addresses[j]) {
                    leastseconds = routeseconds;
                    drivetime = routes[i].duration.text;
                    maisDistantes = 'origem: ' + r.data.origin_addresses[i] + ' - destino: ' + r.data.destination_addresses[j];
                }

            }
        }

        let retorno: any = new Retorno(maisProximos, maisDistantes);
        return retorno;




    }

}