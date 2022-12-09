<template>
    <div class="container page">
        <ClientOnly>
            <aside class="sidebar">
                <h2 class="text-2xl">Available cities</h2>
                <ul class="available-cities">
                    <li v-for="(city, index) in cities"
                        class="available-cities__item">
                        <label class="available-cities__city">
                            <input type="checkbox"
                                   :value="city.name"
                                   @change="checkCity($event)"
                                   v-model="data.selectedCities">
                            <span>{{ city.name }}</span>
                        </label>
                    </li>
                </ul>

                <p class="mb-3">Select day</p>
                <input @change="changeData($event)"
                       type="date"
                       class="input">
            </aside>
            <main class="content">
                <h2 class="title">
                    Forecasts for the day
                </h2>

                <div class="forecast-table-wrap">
                    <table v-if="data.citiesArray"
                           class="forecast-table">
                        <tr>
                            <th @click="sort($event, 'name')" class="js-sort">
                                <div class="forecast-table__sort-wrap">
                                    City
                                    <img class="forecast-table__sort"
                                         src="~/assets/img/ico-sort.svg"
                                         alt="">
                                </div>
                            </th>
                            <th @click="sort($event, 'min')" class="js-sort">
                                <div class="forecast-table__sort-wrap">
                                    MinTemp
                                    <img class="forecast-table__sort"
                                         src="~/assets/img/ico-sort.svg"
                                         alt="">
                                </div>
                            </th>
                            <th @click="sort($event, 'max')" class="js-sort">
                                <div class="forecast-table__sort-wrap">
                                    MaxTemp
                                    <img class="forecast-table__sort"
                                         src="~/assets/img/ico-sort.svg"
                                         alt="">
                                </div>
                            </th>
                            <th></th>
                        </tr>
                        <tr v-if="!data.citiesArray.length">
                            <td colspan="3"
                                class="text-center text-xl">Select the cities</td>
                            <td></td>
                        </tr>
                        <tr v-for="(city, index) in data.citiesArray"
                            :key="city.name">
                            <td>
                                {{ city.name }}
                            </td>
                            <td>
                                {{ city.min }}
                            </td>
                            <td>
                                {{ city.max }}
                            </td>
                            <td>
                                <a class="forecast-table__delete"
                                   @click="deleteCity(index)"
                                   href="#">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         viewBox="0 0 1000 1000"
                                         xml:space="preserve">
                                        <path
                                              d="M500 850c12.9 0 23.3-10.4 23.3-23.3v-490c0-12.9-10.4-23.3-23.3-23.3s-23.3 10.4-23.3 23.3v490c0 12.8 10.4 23.3 23.3 23.3zm-116.7 0c12.9 0 23.3-10.4 23.3-23.3l-23.3-490c0-12.9-10.4-23.3-23.3-23.3s-23.3 10.4-23.3 23.3l23.3 490c0 12.8 10.4 23.3 23.3 23.3zM920 173.3H710v-70c0-51.5-41.8-93.3-93.3-93.3H383.3c-51.5 0-93.3 41.8-93.3 93.3v70H80c-12.9 0-23.3 10.4-23.3 23.3s10.4 23.3 23.3 23.3h97.9l65.5 676.7c0 51.6 41.8 93.3 93.3 93.3h326.7c51.6 0 93.3-41.8 93.3-93.3L822.1 220H920c12.9 0 23.3-10.5 23.3-23.3 0-12.9-10.4-23.4-23.3-23.4zm-583.3-70c0-25.8 20.9-46.7 46.7-46.7h233.3c25.8 0 46.7 20.9 46.7 46.7v70H336.7v-70zM710 896.7c0 25.8-20.9 46.7-46.7 46.7H336.7c-25.8 0-46.7-20.9-46.7-46.7L224.5 220h551L710 896.7zM616.7 850c12.9 0 23.3-10.4 23.3-23.3l23.3-490c0-12.9-10.4-23.3-23.3-23.3s-23.3 10.4-23.3 23.3l-23.3 490c-.1 12.8 10.4 23.3 23.3 23.3z" />
                                    </svg>
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>
            </main>
        </ClientOnly>
    </div>
</template>

<script setup>
import cities from '~~/constants/cities';

const data = reactive({
    citiesArray: [],
    selectedCities: ['Kyiv'],
    date: '2022-12-07'
})

onMounted(() => {
    setTimeout(() => {
        getData()
    }, 1);
})

const getData = () => {
    const citiesResult = [];
    data.citiesArray = [];
    cities.forEach(city => {
        data.selectedCities.forEach(selectedCity => {
            if (city.name == selectedCity) {
                citiesResult.push(city)
            }
        })
    });

    citiesResult.forEach(async (city) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.location[0]}&longitude=${city.location[1]}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&start_date=${data.date}&end_date=${data.date}`;
        const { data: responce } = await useFetch(url);
        if (responce.value) {
            data.citiesArray.push({
                name: city.name,
                min: responce.value.daily.temperature_2m_min[0],
                max: responce.value.daily.temperature_2m_max[0]
            });
        }
    })
};

const deleteCity = (index) => {
    data.citiesArray.splice(index, 1);

    let result = [];
    data.citiesArray.forEach(city => {
        data.selectedCities.forEach(selectedCity => {
            if (selectedCity == city.name) {
                result.push(selectedCity)
            }
        })
    })
    data.selectedCities = result;
};

const checkCity = (e) => {
    getData();
};

const changeData = (e) => {
    data.date = e.target.value
    getData();
};

const sort = (event, param) => {
    console.log('sort');
    const target = event.target.closest('.js-sort')
    
    document.querySelectorAll('.js-sort').forEach(item => {
        if(item != target) {
            item.classList.remove('descending')
            item.classList.remove('ascending')
        }
    });

    if (param == 'name') {
        if(!target.classList.contains('ascending') || target.classList.contains('descending') ) {
            target.classList.remove('descending')
            target.classList.add('ascending')
            data.citiesArray.sort((a, b) => a.name.localeCompare(b.name));
            return
        }
        if(target.classList.contains('ascending') || !target.classList.contains('descending') ) {
            target.classList.remove('ascending')
            target.classList.add('descending')
            data.citiesArray.sort((a, b) => b.name.localeCompare(a.name));
            return
        }
    }
    if (param == 'min') {
        if(!target.classList.contains('ascending') || target.classList.contains('descending') ) {
            target.classList.remove('descending')
            target.classList.add('ascending')
            data.citiesArray.sort((a, b) => a.min - b.min);
            return
        }
        if(target.classList.contains('ascending') || !target.classList.contains('descending') ) {
            target.classList.remove('ascending')
            target.classList.add('descending')
            data.citiesArray.sort((a, b) => b.min - a.min);
            return
        }
    }
    if (param == 'max') {
        if(!target.classList.contains('ascending') || target.classList.contains('descending') ) {
            target.classList.remove('descending')
            target.classList.add('ascending')
            data.citiesArray.sort((a, b) => a.max - b.max);
            return
        }
        if(target.classList.contains('ascending') || !target.classList.contains('descending') ) {
            target.classList.remove('ascending')
            target.classList.add('descending')
            data.citiesArray.sort((a, b) => b.max - a.max);
            return
        }
    }
};
</script>





<style lang="scss" scoped src="./index.scss" />