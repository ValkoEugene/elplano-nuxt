import VuexORM from '@vuex-orm/core'
import Course from '~/models/Course'
import Lecturer from '~/models/Lecturer'
import Student from '~/models/Student'
import Event from '~/models/Event'

// Create a new instance of Database.
const database = new VuexORM.Database()

database.register(Course)
database.register(Lecturer)
database.register(Student)
database.register(Event)

export default VuexORM.install(database)
