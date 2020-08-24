
Vue.use(window.vuelidate.default)
const { required, alpha } = window.validators 

// get current date
const currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1 ;
if (currentMonth.toString().length === 1) {
    currentMonth = `0${currentMonth}`
}            
let currentDay = new Date().getDate();
if (currentDay.toString().length === 1) {
    currentDay = `0${currentDay}`
}
const currentDate = `${currentDay}.${currentMonth}.${currentYear}`
//

function compareDates(date1, date2){
    let parts =date1.split('.');
    let d1 = Number(parts[2] + parts[1] + parts[0]);
    parts = date2.split('.');
    let d2 = Number(parts[2] + parts[1] + parts[0]);
    return d1 <= d2;
}

function dateFormatCorrect(date) {
    const correct = /^\d{2}\.\d{2}\.\d{4}$/.test(date)
    let result = false
    if (correct ) {
        let elements = date.split(".")
        if (parseInt(elements[0]) <= 31 &&  parseInt(elements[1]) <= 12) {
            result = true
        }
    }
    return result;
}

new Vue({
    el: "#app",
    data: {
        uiState: "submit not clicked",
        formTouched: false,
        errors: false,
        empty: true,
        formResponses: {
            surname: '',
            name: '',
            patronymic: '',
            birthDate: '',
            phoneNumber: '',
            gender: 'Man',
            genders: {
                man: "Man",
                woman: "Woman"
            },
            clientGroups: ["VIP", "Medical insurance", "Problematic"],
            checkedClientGroups: [],                    
            attendingDoctor: '',
            attendingDoctors: ["Jhons", "Swartzmiller", "Saba"],
            noSMS: false,
            postIndex: '',
            country: '',
            region: '',
            city: '',
            street: '',
            dwelling: '',
            document: '',
            documents: ["Passport", "Birth certificate", "Driver's license"],
            docSeries: '',
            docNumber: '',
            docIssuedBy: '',
            docIssueDate: ''
        }
    },
    validations: {
        formResponses: {
            surname: {
                required,
                alpha
            },
            name: {
                required,
                alpha
            },
            birthDate: {
                required,
                validDate(birthDate) {
                    let result = false
                    if (dateFormatCorrect(birthDate)) {
                        result = compareDates(birthDate, currentDate)
                    }
                    return result;
                }
            },
            phoneNumber: {
                required,
                validPhoneNumber(phoneNumber) {
                    return (
                        /^7\s\d{3}\s\d{3}-\d{4}/.test(phoneNumber) 
                    );
                }                        
            },
            checkedClientGroups: {
                validClientGroups(checkedClientGroups) {
                    return (
                        checkedClientGroups.length > 0
                    );
                }  
            },
            city: {
                required,
                alpha
            },
            document: {
                required
            },
            docIssueDate: {
                required,
                validDate(docIssueDate) {
                    let result = false
                    if (dateFormatCorrect(docIssueDate)) {
                        result = compareDates(docIssueDate, currentDate)
                    }
                    return result;
                }
            }
        }                   
    },
    methods: {
        status(validation) {
            return {
                error: validation.$error,
                dirty: validation.$dirty
            }
        },
        onSubmit() {
            this.errors = false;
            this.formTouched = this.$v.formResponses.$anyDirty;
            this.errors = this.$v.formResponses.$invalid;
            this.uiState = "submit clicked";
            if (this.errors === false && this.formTouched === true) {
                //this is where you send the responses
                this.uiState = "form submitted";
            }
        },
        acceptNumber() {
            number = this.formResponses.phoneNumber
            let x = number.replace(/\D/g, '')
            if (x) {
                x = x.match(/(\d{1})(\d{0,3})(\d{0,3})(\d{0,4})/);
            }
            this.formResponses.phoneNumber = (x[1] ? x[1] : '') + (x[2] ? ' ' + x[2] : '') + (x[3] ? ' ' + x[3] : '') + (x[4] ? '-' + x[4] : '');
        }
    }
})  
