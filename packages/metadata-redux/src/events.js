
/**
 * Action Handlers - обработчики событий - вызываются из корневого редюсера
 */
export const ACTION_HANDLERS = {
	[META_LOADED]:          (state, action) => Object.assign({}, state, {meta_loaded: true}),

	[POUCH_DATA_LOADED]:    (state, action) => Object.assign({}, state, {data_loaded: true}),
	[POUCH_DATA_PAGE]:      (state, action) => Object.assign({}, state, {page: action.payload}),
	[POUCH_DATA_ERROR]:     (state, action) => Object.assign({}, state, {err: action.payload}),
	[POUCH_LOAD_START]:     (state, action) => Object.assign({}, state, {data_empty: false, fetch_local: true}),
	[POUCH_NO_DATA]:        (state, action) => Object.assign({}, state, {data_empty: true}),

	[USER_DEFINED]:     (state, action) => Object.assign({}, state, {user: {
		name: action.payload,
		logged_in: state.user.logged_in
	}}),
	[USER_LOG_IN]:      (state, action) => Object.assign({}, state, {user: {
		name: action.payload,
		logged_in: true
	}}),
	[USER_LOG_OUT]:     (state, action) => Object.assign({}, state, {user: {
		name: state.user.name,
		logged_in: false
	}})

}

/**
 * Reducer
 */
const initialState = {
	meta_loaded: false,
	data_loaded: false,
	data_empty: true,
	fetch_local: false,
	fetch_remote: false,
	user: {
		name: "",
		logged_in: false
	}
}
function rx_reducer (state = initialState, action) {

	const handler = ACTION_HANDLERS[action.type]

	if(handler){
		console.log(action)
		return handler(state, action)
	}else
		return state
}


/**
 * Подключает диспетчеризацию событий redux к pouchdb
 */
function rx_events(store) {

	this.wsql.pouch.on({

		user_log_in: (name) => {store.dispatch(user_log_in(name))},

		user_log_out: () => {store.dispatch(user_log_out())},

		pouch_data_page: (page) => {store.dispatch(pouch_data_page(page))},

		pouch_data_loaded: (page) => {store.dispatch(pouch_data_loaded(page))},

		pouch_data_error: (dbid, err) => {store.dispatch(pouch_data_error(dbid, err))},

		pouch_load_start: (page) => {store.dispatch(pouch_load_start(page))},

		pouch_no_data: (dbid, err) => {store.dispatch(pouch_no_data(dbid, err))},

		pouch_sync_start: () => {store.dispatch(pouch_sync_start())},

		pouch_change: (dbid, change) => {store.dispatch(pouch_change(dbid, change))},

		pouch_sync_error: (dbid, err) => {store.dispatch(pouch_sync_error(dbid, err))}
	})

}

/**
 * Экспортируем объект-плагин для модификации metadata.js
 */
const plugin = {

	proto(proto) {

		Object.defineProperties(proto, {

			rx_actions: {
				value: actions
			},

			rx_reducer: {
				value: rx_reducer
			},

			rx_events: {
				value: rx_events
			}
		})

	},

	constructor(){

	}
}
export default plugin;