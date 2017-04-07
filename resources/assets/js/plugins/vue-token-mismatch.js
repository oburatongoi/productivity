const VueTokenMismatch = {
    install(Vue, options = null) {

        Vue.handleTokenMismatch = function(payload) {
            return new Promise((resolve, reject) => {

                if (! payload.tokenMismatch || ! payload.input || ! payload.token || ! payload.method) {
                    reject()
                }

                window.Laravel.csrfToken = payload.token
                window.axios.defaults.headers.common['X-CSRF-TOKEN'] = payload.token


                switch (payload.method) {
                    case 'PATCH':
                        axios.patch(payload.url, payload.input)
                        .then(
                            (success) => resolve(success)
                        ).catch(
                            (error) => reject(error)
                        )
                        break;
                    case 'PUT':
                        axios.put(payload.url, payload.input)
                        .then(
                            (success) => resolve(success)
                        ).catch(
                            (error) => reject(error)
                        )
                        break;
                    case 'DELETE':
                        axios.delete(payload.url, payload.input)
                        .then(
                            (success) => resolve(success)
                        ).catch(
                            (error) => reject(error)
                        )
                        break;
                    default: axios.post(payload.url, payload.input)
                    .then(
                        (success) => resolve(success)
                    ).catch(
                        (error) => reject(error)
                    )
                }

            })
        }
    }
}

export default VueTokenMismatch;
