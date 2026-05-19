"use strict";



const IMAGES = {
    icons: {
        home: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIxMS42NjcgMjExLjY2NyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBzdHlsZT0iZGlzcGxheTppbmxpbmU7ZmlsbDojN2ViYzQxO2ZpbGwtb3BhY2l0eToxO3N0cm9rZS13aWR0aDouNzMxMTM7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7cGFpbnQtb3JkZXI6ZmlsbCBtYXJrZXJzIHN0cm9rZSIgZD0iTTEwNS44MzMgMEExMDUuODMzIDEwNS44MzMgMCAwIDAgMCAxMDUuODMzYTEwNS44MzMgMTA1LjgzMyAwIDAgMCAxMDUuODMzIDEwNS44MzQgMTA1LjgzMyAxMDUuODMzIDAgMCAwIDEwNS44MzQtMTA1LjgzNEExMDUuODMzIDEwNS44MzMgMCAwIDAgMTA1LjgzMyAwbTAgNDguMzY4YzEuOTg4IDAgMi4zMzguMDUgMy43MDYuNTI4IDEuMjI1LjQyOCA2LjA5NSAzLjI3NyAyNS44MSAxNS4wOTYgMjIuNzYzIDEzLjY0NSAyNC4zOCAxNC42NDYgMjUuNTMxIDE1LjgwNyAxLjQyMyAxLjQzNCAyLjM5NSAyLjk5NyAyLjk0NyA0LjczOWwuMzkgMS4yMjl2NjguMzA0bC0uNDcgMS4yODhjLS42ODQgMS44NzEtMS40NzYgMy4xMTUtMi44NjcgNC41MDYtMS4zOSAxLjM5LTIuNjM1IDIuMTgzLTQuNTA2IDIuODY2bC0xLjI4OC40Ny0xOC43MzYuMDQ5LTE4LjczNS4wNDktLjA1NS0xNC44ODYtLjA1NC0xNC44ODYtLjQ3Ni0xLjQwNWMtLjk2LTIuODI4LTIuODYtNS4yMzQtNS4yNC02LjYzMi0xLjkyLTEuMTI5LTMuNjA0LTEuNTczLTUuOTU3LTEuNTczLTEuNjk0IDAtMi4yNDUuMDcyLTMuNDI0LjQ1NC0zLjc0NSAxLjIxMy02LjQ4IDMuOTQtNy43NzIgNy43NTFsLS40NzcgMS40MDUtLjA1NCAxNC44ODEtLjA1NCAxNC44ODEtMTguMjk3LS4wMTRjLTE0LjQyLS4wMS0xOC41Mi0uMDYyLTE5LjM1LS4yNDQtMy44NjgtLjg0OC03LjAzOS0zLjcxNC04LjQ4NC03LjY3MmwtLjQ3LTEuMjg4Vjg1Ljc2N2wuMzg4LTEuMjI5Yy41NTItMS43NDIgMS41MjUtMy4zMDUgMi45NDgtNC43NCAxLjE1LTEuMTYgMi43NjctMi4xNiAyNS41My0xNS44MDYgMTkuNzE2LTExLjgyIDI0LjU4Ni0xNC42NjggMjUuODExLTE1LjA5NiAxLjM2OC0uNDc4IDEuNzE4LS41MjggMy43MDUtLjUyOG0wIDExLjc2M2MtLjE2IDAtMTAuNzcgNi4yODItMjMuNTggMTMuOTZMNTguOTYzIDg4LjA1bC0uMDA2IDMxLjgyNS0uMDA2IDMxLjgyNWgyMy41MWwuMDY2LTkuNzg5Yy4wNzItMTAuNjE2LjA3My0xMC42MjYgMS4xMjktMTMuNzQgMi44NTUtOC40MTcgMTAuMTExLTE0LjQ2IDE4Ljk2My0xNS43ODggMS42Mi0uMjQzIDQuODA5LS4yNDMgNi40MyAwIDguODUgMS4zMjkgMTYuMTA3IDcuMzcgMTguOTYyIDE1Ljc4OCAxLjA1NiAzLjExNCAxLjA1NyAzLjEyNCAxLjEyOCAxMy43NGwuMDY2IDkuNzloMjMuNTFsLS4wMDYtMzEuODI2LS4wMDYtMzEuODI1LTIzLjI5LTEzLjk2Yy0xMi44MS03LjY3Ny0yMy40Mi0xMy45NTktMjMuNTgtMTMuOTU5Ii8+PC9zdmc+",
        home2: "M105.833 0A105.833 105.833 0 0 0 0 105.833a105.833 105.833 0 0 0 105.833 105.834 105.833 105.833 0 0 0 105.834-105.834A105.833 105.833 0 0 0 105.833 0m0 48.368c1.988 0 2.338.05 3.706.528 1.225.428 6.095 3.277 25.81 15.096 22.763 13.645 24.38 14.646 25.531 15.807 1.423 1.434 2.395 2.997 2.947 4.739l.39 1.229v68.304l-.47 1.288c-.684 1.871-1.476 3.115-2.867 4.506-1.39 1.39-2.635 2.183-4.506 2.866l-1.288.47-18.736.049-18.735.049-.055-14.886-.054-14.886-.476-1.405c-.96-2.828-2.86-5.234-5.24-6.632-1.92-1.129-3.604-1.573-5.957-1.573-1.694 0-2.245.072-3.424.454-3.745 1.213-6.48 3.94-7.772 7.751l-.477 1.405-.054 14.881-.054 14.881-18.297-.014c-14.42-.01-18.52-.062-19.35-.244-3.868-.848-7.039-3.714-8.484-7.672l-.47-1.288V85.767l.388-1.229c.552-1.742 1.525-3.305 2.948-4.74 1.15-1.16 2.767-2.16 25.53-15.806 19.716-11.82 24.586-14.668 25.811-15.096 1.368-.478 1.718-.528 3.705-.528m0 11.763c-.16 0-10.77 6.282-23.58 13.96L58.963 88.05l-.006 31.825-.006 31.825h23.51l.066-9.789c.072-10.616.073-10.626 1.129-13.74 2.855-8.417 10.111-14.46 18.963-15.788 1.62-.243 4.809-.243 6.43 0 8.85 1.329 16.107 7.37 18.962 15.788 1.056 3.114 1.057 3.124 1.128 13.74l.066 9.79h23.51l-.006-31.826-.006-31.825-23.29-13.96c-12.81-7.677-23.42-13.959-23.58-13.959",
        presentation: "data:image/svg+xml,%3Csvg%20width%3D%22800%22%20height%3D%22800%22%20viewBox%3D%220%200%20211.667%20211.667%22%20xml%3Aspace%3D%22preserve%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20style%3D%22display%3Ainline%3Bfill%3A%23fff%3Bstroke-width%3A.73113%3Bstroke-linecap%3Around%3Bpaint-order%3Afill%20markers%20stroke%22%20d%3D%22M105.833%200A105.833%20105.833%200%200%200%200%20105.833a105.833%20105.833%200%200%200%20105.833%20105.834%20105.833%20105.833%200%200%200%20105.834-105.834A105.833%20105.833%200%200%200%20105.833%200m0%2048.224c.654%200%201.308.16%201.98.477%202.02.955%202.815%202.312%202.815%204.809v1.567l22.671.056%2022.672.055.884.574c1.335.869%202%202.015%202.103%203.629.106%201.672-.305%202.836-1.373%203.878-.75.733-2.183%201.405-2.993%201.405-.376%200-.39.931-.443%2031.148l-.055%2031.149-.634.903c-.35.498-1.053%201.139-1.564%201.426l-.928.521-19.251.104-19.25.104%209.285%2012.967c5.107%207.132%209.42%2013.23%209.584%2013.551%201.66%203.244-1.044%207.196-4.708%206.877-2.414-.21-2.136.107-11.85-13.493-8.711-12.196-8.783-12.29-9.14-11.824-.197.258-4.227%205.793-8.955%2012.3-9.503%2013.077-9.28%2012.827-11.645%2013.001-.741.055-1.507-.027-2.006-.213-2.576-.958-3.88-4.168-2.675-6.586.257-.516%204.685-6.707%209.84-13.759l9.371-12.82-19.434-.105-19.435-.104-.929-.521c-.51-.287-1.214-.928-1.563-1.426l-.635-.903-.055-31.149c-.053-30.217-.066-31.148-.442-31.148-.81%200-2.243-.672-2.993-1.405-1.068-1.042-1.48-2.206-1.373-3.878.103-1.614.767-2.76%202.103-3.629l.884-.574%2022.671-.055%2022.671-.056V53.51c0-2.497.795-3.854%202.815-4.809.673-.318%201.326-.477%201.98-.477m-38.775%2021.87v50.033h77.551V70.094h-38.776z%22%2F%3E%3C%2Fsvg%3E",
        presentation2: "M105.833 0A105.833 105.833 0 0 0 0 105.833a105.833 105.833 0 0 0 105.833 105.834 105.833 105.833 0 0 0 105.834-105.834A105.833 105.833 0 0 0 105.833 0m0 48.224c.654 0 1.308.16 1.98.477 2.02.955 2.815 2.312 2.815 4.809v1.567l22.671.056 22.672.055.884.574c1.335.869 2 2.015 2.103 3.629.106 1.672-.305 2.836-1.373 3.878-.75.733-2.183 1.405-2.993 1.405-.376 0-.39.931-.443 31.148l-.055 31.149-.634.903c-.35.498-1.053 1.139-1.564 1.426l-.928.521-19.251.104-19.25.104 9.285 12.967c5.107 7.132 9.42 13.23 9.584 13.551 1.66 3.244-1.044 7.196-4.708 6.877-2.414-.21-2.136.107-11.85-13.493-8.711-12.196-8.783-12.29-9.14-11.824-.197.258-4.227 5.793-8.955 12.3-9.503 13.077-9.28 12.827-11.645 13.001-.741.055-1.507-.027-2.006-.213-2.576-.958-3.88-4.168-2.675-6.586.257-.516 4.685-6.707 9.84-13.759l9.371-12.82-19.434-.105-19.435-.104-.929-.521c-.51-.287-1.214-.928-1.563-1.426l-.635-.903-.055-31.149c-.053-30.217-.066-31.148-.442-31.148-.81 0-2.243-.672-2.993-1.405-1.068-1.042-1.48-2.206-1.373-3.878.103-1.614.767-2.76 2.103-3.629l.884-.574 22.671-.055 22.671-.056V53.51c0-2.497.795-3.854 2.815-4.809.673-.318 1.326-.477 1.98-.477m-38.775 21.87v50.033h77.551V70.094h-38.776z",
        print: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIHN0eWxlPSJmaWxsOiNmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOi4wMzYwMjc0O3N0cm9rZS1saW5lY2FwOnJvdW5kO3BhaW50LW9yZGVyOmZpbGwgbWFya2VycyBzdHJva2UiIGQ9Ik0xMiAwQTEyIDEyIDAgMCAwIDAgMTJhMTIgMTIgMCAwIDAgMTIgMTIgMTIgMTIgMCAwIDAgMTItMTJBMTIgMTIgMCAwIDAgMTIgME04Ljc4IDUuNDI1aDYuNDRsLjEyNi4wNDRjLjM1MS4xMjMuNjY0LjQ2My43ODUuODU1LjAzOS4xMjYuMDQuMTUyLjA0NSAxLjI0OWwuMDA1IDEuMTIuNzA0LjAwOGMuNzIzLjAxLjc0Mi4wMTIuOTQ1LjEuMjg1LjEyMS41NDguNDEuNjYuNzI1LjA4Ny4yNDUuMDg1LjE3Ny4wODUgMi40NzFzLjAwMiAyLjIyNy0uMDg1IDIuNDcxYTEuMyAxLjMgMCAwIDEtLjY2LjcyNmMtLjIwMy4wODgtLjIyMi4wOS0uOTQ1LjA5OWwtLjcwNC4wMDktLjAwNSAxLjEyYy0uMDA1IDEuMDk2LS4wMDYgMS4xMjItLjA0NSAxLjI0OC0uMTIuMzg2LS40MjUuNzIzLS43NzYuODU2bC0uMTE3LjA0My0zLjIwMi4wMDRjLTMuMTA2LjAwNC0zLjIwNi4wMDMtMy4zMzMtLjAzMy0uMzItLjA5My0uNjE3LS4zNjUtLjc3NC0uNzA4YTIgMiAwIDAgMS0uMDc0LS4yMzZjLS4wMzMtLjEzOS0uMDM1LS4yMjYtLjAzNS0xLjIyMnYtMS4wNzJsLS43MDQtLjAwOWMtLjcyNC0uMDEtLjc0My0uMDExLS45NDYtLjA5OWExLjMgMS4zIDAgMCAxLS42Ni0uNzI2Yy0uMDg3LS4yNDQtLjA4NS0uMTc2LS4wODUtMi40N3MtLjAwMi0yLjIyNy4wODUtMi40NzJjLjExMi0uMzE1LjM3NS0uNjA0LjY2LS43MjYuMjAzLS4wODcuMjIyLS4wOS45NDUtLjA5OWwuNzA0LS4wMDkuMDA1LTEuMTJjLjAwNS0xLjA5Ni4wMDYtMS4xMjIuMDQ1LTEuMjQ4cS4wOS0uMjkzLjMwMy0uNTIzYy4xNS0uMTYyLjMwNy0uMjcxLjQ4Mi0uMzMyWm0uMjI0IDEuMjk1djEuOTc2aDUuOTkyVjYuNzJIMTJ6bS0yLjM4NiAzLjN2My45NTRINy44MnYtMS4wNDdjMC0xLjAyIDAtMS4wNS4wMzgtMS4xNjFhLjY4LjY4IDAgMCAxIC4zNDQtLjM3OWwuMTA0LS4wNDJoNy4zODhsLjEwNC4wNDJhLjY4LjY4IDAgMCAxIC4zNDQuMzc5Yy4wMzcuMTExLjAzOC4xNC4wMzggMS4xNjF2MS4wNDdoMS4yMDJWMTAuMDJIMTJ6bTIuMzg2IDIuNjN2NC42MjVoNS45OTJWMTIuNjVIMTJ6Ii8+PC9zdmc+",
        print2: "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0M8.78 5.425h6.44l.126.044c.351.123.664.463.785.855.039.126.04.152.045 1.249l.005 1.12.704.008c.723.01.742.012.945.1.285.121.548.41.66.725.087.245.085.177.085 2.471s.002 2.227-.085 2.471a1.3 1.3 0 0 1-.66.726c-.203.088-.222.09-.945.099l-.704.009-.005 1.12c-.005 1.096-.006 1.122-.045 1.248-.12.386-.425.723-.776.856l-.117.043-3.202.004c-3.106.004-3.206.003-3.333-.033-.32-.093-.617-.365-.774-.708a2 2 0 0 1-.074-.236c-.033-.139-.035-.226-.035-1.222v-1.072l-.704-.009c-.724-.01-.743-.011-.946-.099a1.3 1.3 0 0 1-.66-.726c-.087-.244-.085-.176-.085-2.47s-.002-2.227.085-2.472c.112-.315.375-.604.66-.726.203-.087.222-.09.945-.099l.704-.009.005-1.12c.005-1.096.006-1.122.045-1.248q.09-.293.303-.523c.15-.162.307-.271.482-.332Zm.224 1.295v1.976h5.992V6.72H12zm-2.386 3.3v3.954H7.82v-1.047c0-1.02 0-1.05.038-1.161a.68.68 0 0 1 .344-.379l.104-.042h7.388l.104.042a.68.68 0 0 1 .344.379c.037.111.038.14.038 1.161v1.047h1.202V10.02H12zm2.386 2.63v4.625h5.992V12.65H12z",
        layers: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIHN0eWxlPSJkaXNwbGF5OmlubGluZTtmaWxsOiNmZmY7c3Ryb2tlLXdpZHRoOi4wNDk2Njc4O3N0cm9rZS1saW5lY2FwOnJvdW5kO3BhaW50LW9yZGVyOmZpbGwgbWFya2VycyBzdHJva2UiIGQ9Ik0xMiAwQTEyIDEyIDAgMCAwIDAgMTJhMTIgMTIgMCAwIDAgMTIgMTIgMTIgMTIgMCAwIDAgMTItMTJBMTIgMTIgMCAwIDAgMTIgMG0wIDQuOTU2cS4wNiAwIC4xMTYuMDFjLjEuMDIgNS43NCAyLjM0NyA2LjIzMiAyLjU3My4zMy4xNTEuNDg3LjM3Ny40ODkuNzA0YS43MS43MSAwIDAgMS0uNDE0LjY4MWMtLjE3LjA4NS02LjEyNiAyLjU2NS02LjIzIDIuNTkzYS44LjggMCAwIDEtLjQ0NC0uMDE4Yy0uMTUtLjA1LTYuMDQ1LTIuNTA5LTYuMTg1LTIuNThhLjcyLjcyIDAgMCAxLS4zMzYtLjM1LjYuNiAwIDAgMS0uMDY1LS4zMjZjLjAwMS0uMzI3LjE1OC0uNTUzLjQ4OS0uNzA0LjQ5Mi0uMjI2IDYuMTMyLTIuNTU0IDYuMjMxLTIuNTczYS42LjYgMCAwIDEgLjExNy0uMDFtMCAxLjU4LTIuMDQ3Ljg1M2MtMS40NjYuNjEtMi4wMzcuODU4LTIuMDEzLjg3My4wNy4wNDUgNC4wNSAxLjcgNC4wNzEgMS42OTNhNTA4IDUwOCAwIDAgMCA0LjA2LTEuNjk5Yy4wMS0uMDA5LS45MDItLjQtMi4wMjctLjg2OHptLTYuMDUxIDQuMzVjLjE2Ni4wMDguMjQ3LjA0IDMuMTEgMS4yMzRMMTIgMTMuMzQ3bDIuOTQtMS4yMjdjMi44NjUtMS4xOTQgMi45NDUtMS4yMjYgMy4xMTItMS4yMzVhLjczNC43MzQgMCAwIDEgLjc3Ny42MDcuNjQuNjQgMCAwIDEtLjA1Ni40NTQuNjMuNjMgMCAwIDEtLjI1OC4zMDhjLS4wODUuMDU4LTUuOTMgMi41MS02LjI2IDIuNjI1YS45LjkgMCAwIDEtLjQ3MS4wMTZjLS4yNTgtLjA5LTYuMTg3LTIuNTcxLTYuMjY5LTIuNjIzYS42Ni42NiAwIDAgMS0uMjg2LS4zMjYuNjQuNjQgMCAwIDEtLjA1Ny0uNDU0LjcyLjcyIDAgMCAxIC4yNDUtLjQyOC43LjcgMCAwIDEgLjUzMy0uMTc5bTEyLjEyNSAzLjM3NmMuMjEzIDAgLjQzMy4wODUuNTYyLjIzLjE3LjE4OC4yNDguNDY2LjE5NC42ODZhLjguOCAwIDAgMS0uMzg0LjUwNWMtLjAzNS4wMTgtMS40NTEuNjExLTMuMTQ2IDEuMzE4bC0zLjA4MyAxLjI4Ni0uMTgzLjAwN2EuOS45IDAgMCAxLS4yNzQtLjAyM2MtLjA5Mi0uMDMxLTUuOTMtMi40NjMtNi4xNDUtMi41NmEuNzUyLjc1MiAwIDAgMS0uMzQ0LTEuMDkzLjcuNyAwIDAgMSAuNjc4LS4zNTNjLjE2Ni4wMDguMjQ3LjA0IDMuMTEgMS4yMzVMMTIgMTYuNzI2bDIuODg0LTEuMjAxYTI0NiAyNDYgMCAwIDEgMi45ODYtMS4yMzMuNy43IDAgMCAxIC4yMDUtLjAzIi8+PC9zdmc+",
        layers2: "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0m0 4.956q.06 0 .116.01c.1.02 5.74 2.347 6.232 2.573.33.151.487.377.489.704a.71.71 0 0 1-.414.681c-.17.085-6.126 2.565-6.23 2.593a.8.8 0 0 1-.444-.018c-.15-.05-6.045-2.509-6.185-2.58a.72.72 0 0 1-.336-.35.6.6 0 0 1-.065-.326c.001-.327.158-.553.489-.704.492-.226 6.132-2.554 6.231-2.573a.6.6 0 0 1 .117-.01m0 1.58-2.047.853c-1.466.61-2.037.858-2.013.873.07.045 4.05 1.7 4.071 1.693a508 508 0 0 0 4.06-1.699c.01-.009-.902-.4-2.027-.868zm-6.051 4.35c.166.008.247.04 3.11 1.234L12 13.347l2.94-1.227c2.865-1.194 2.945-1.226 3.112-1.235a.734.734 0 0 1 .777.607.64.64 0 0 1-.056.454.63.63 0 0 1-.258.308c-.085.058-5.93 2.51-6.26 2.625a.9.9 0 0 1-.471.016c-.258-.09-6.187-2.571-6.269-2.623a.66.66 0 0 1-.286-.326.64.64 0 0 1-.057-.454.72.72 0 0 1 .245-.428.7.7 0 0 1 .533-.179m12.125 3.376c.213 0 .433.085.562.23.17.188.248.466.194.686a.8.8 0 0 1-.384.505c-.035.018-1.451.611-3.146 1.318l-3.083 1.286-.183.007a.9.9 0 0 1-.274-.023c-.092-.031-5.93-2.463-6.145-2.56a.752.752 0 0 1-.344-1.093.7.7 0 0 1 .678-.353c.166.008.247.04 3.11 1.235L12 16.726l2.884-1.201a246 246 0 0 1 2.986-1.233.7.7 0 0 1 .205-.03",
        screenshot: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIHN0eWxlPSJmaWxsOiNmZmY7c3Ryb2tlLXdpZHRoOi4wNDk2Njc4O3N0cm9rZS1saW5lY2FwOnJvdW5kO3BhaW50LW9yZGVyOmZpbGwgbWFya2VycyBzdHJva2UiIGQ9Ik0xMiAwQTEyIDEyIDAgMCAwIDAgMTJhMTIgMTIgMCAwIDAgMTIgMTIgMTIgMTIgMCAwIDAgMTItMTJBMTIgMTIgMCAwIDAgMTIgMG0tLjAwMiA1LjQxN2MxLjExNiAwIDIuMjMxLjAxIDIuMzIyLjAyOGEuOC44IDAgMCAxIC4yMy4wOWMuMDU1LjAzNS4zODguMzg1Ljc1OS44bC42Ni43MzZoMWMuNTk2IDAgMS4wNTkuMDExIDEuMTQ0LjAyNy41NjYuMTAzIDEuMDQuNjEgMS4xNzYgMS4yNi4wNDkuMjMzLjA1IDguNjc2IDAgOC45MzktLjA4NC40NTMtLjM5NS45LS43NjEgMS4wOTctLjM3OC4yMDQuMjk2LjE4NC02LjQzLjE4OC0zLjMwMy4wMDItNi4wNy0uMDA1LTYuMTQ4LS4wMTYtLjQ2Ny0uMDYzLS45MTItLjQxNy0xLjEyLS44ODgtLjE2Ni0uMzc4LS4xNTUtLjA2LS4xNTYtNC44NiAwLTQuMTY4LjAwMS00LjMxNC4wNDItNC40OUExLjYyIDEuNjIgMCAwIDEgNS43MyA3LjEzYy4xMDktLjA0LjIzNC0uMDQ2IDEuMjEtLjA1NGwxLjA4OS0uMDA4LjY2LS43MzZjLjM2Ni0uNDA3LjcwNC0uNzYzLjc1OS0uNzk4YS44LjggMCAwIDEgLjIzLS4wOWMuMDktLjAxOCAxLjIwNS0uMDI4IDIuMzIxLS4wMjhNMTAuMDk3IDcuMDdsLS42Ny43NWMtLjQwNS40NTItLjcwNy43Ny0uNzYuOC0uMTY3LjA5My0uMzEuMTAzLTEuNDQ1LjEwM0g2LjEyNnY4LjIxNUgxNy44N1Y4LjcyNGgtMS4wOTZjLTEuMTM1IDAtMS4yNzctLjAxLTEuNDQ0LS4xMDMtLjA1My0uMDMtLjM1Ni0uMzQ4LS43Ni0uOGwtLjY3MS0uNzVoLTEuOTAyem0xLjk1NCAyLjA2NXEuMjc1LjAwNi41NTMuMDdjLjU1My4xMjcgMS4wNTMuNDM0IDEuNDYzLjg5OC40MTcuNDcyLjY3NSAxLjAwNS44MDMgMS42NTUuMDU1LjI4Mi4wNjcuODU1LjAyNCAxLjE0MWEzLjcgMy43IDAgMCAxLS41MiAxLjQyOGMtLjQ3OC43NTYtMS4yNDIgMS4yNTUtMi4wNjIgMS4zNTEtLjI3NS4wMzItLjQxMS4wMy0uNjk4LS4wMWEyLjIgMi4yIDAgMCAxLS42OTYtLjIwNWMtLjk3NC0uNDQtMS42MzItMS4zNzEtMS44MTQtMi41NjRhNC40IDQuNCAwIDAgMSAuMDI0LTEuMTQxYy4xMjgtLjY1LjM5LTEuMTg5LjgwMy0xLjY1NS41NzYtLjY0OCAxLjMyOC0uOTg2IDIuMTItLjk2OG0tLjA1NSAxLjYzNmMtLjg3IDAtMS41NTkuODc4LTEuNDUgMS44NS4wNzUuNjczLjUyMyAxLjIzIDEuMTE3IDEuMzkyLjE3LjA0Ni40OS4wNDcuNjYyLjAwMS41MzYtLjE0MS45MzItLjU3IDEuMDkzLTEuMTgzLjA0Ny0uMTguMDU0LS41OC4wMTMtLjc3N2EyLjIgMi4yIDAgMCAwLS4zMzMtLjcyMmMtLjI4Ny0uMzYtLjY4My0uNTYxLTEuMTAyLS41NjEiLz48L3N2Zz4=",
        screenshot2: "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0m-.002 5.417c1.116 0 2.231.01 2.322.028a.8.8 0 0 1 .23.09c.055.035.388.385.759.8l.66.736h1c.596 0 1.059.011 1.144.027.566.103 1.04.61 1.176 1.26.049.233.05 8.676 0 8.939-.084.453-.395.9-.761 1.097-.378.204.296.184-6.43.188-3.303.002-6.07-.005-6.148-.016-.467-.063-.912-.417-1.12-.888-.166-.378-.155-.06-.156-4.86 0-4.168.001-4.314.042-4.49A1.62 1.62 0 0 1 5.73 7.13c.109-.04.234-.046 1.21-.054l1.089-.008.66-.736c.366-.407.704-.763.759-.798a.8.8 0 0 1 .23-.09c.09-.018 1.205-.028 2.321-.028M10.097 7.07l-.67.75c-.405.452-.707.77-.76.8-.167.093-.31.103-1.445.103H6.126v8.215H17.87V8.724h-1.096c-1.135 0-1.277-.01-1.444-.103-.053-.03-.356-.348-.76-.8l-.671-.75h-1.902zm1.954 2.065q.275.006.553.07c.553.127 1.053.434 1.463.898.417.472.675 1.005.803 1.655.055.282.067.855.024 1.141a3.7 3.7 0 0 1-.52 1.428c-.478.756-1.242 1.255-2.062 1.351-.275.032-.411.03-.698-.01a2.2 2.2 0 0 1-.696-.205c-.974-.44-1.632-1.371-1.814-2.564a4.4 4.4 0 0 1 .024-1.141c.128-.65.39-1.189.803-1.655.576-.648 1.328-.986 2.12-.968m-.055 1.636c-.87 0-1.559.878-1.45 1.85.075.673.523 1.23 1.117 1.392.17.046.49.047.662.001.536-.141.932-.57 1.093-1.183.047-.18.054-.58.013-.777a2.2 2.2 0 0 0-.333-.722c-.287-.36-.683-.561-1.102-.561"
    }
}
$(function () {

    let __dashOffset__ = 0;
    let _stop_anim_ = true;

    let _ANIMATION_;

    const _FONT_FAMILY_ = {
        font1: "'Times New Roman'",
        font2: "Helvetica"
    };
    const _HELPERS_ = {
        data: {

            CalculeSubTotal(_data_) {
                try {
                    let _tmp_ = [];
                    let _total_ = 0;




                    _data_.forEach((section, index) => {




                        const totalSalary = section.table.reduce((sum, row) => {
                            const salary = parseFloat(row.SALARY || "0");

                            return sum + (isNaN(salary) ? 0 : salary);
                        }, 0);

                        _total_ += Number(totalSalary);

                        section.table.push({
                            CC: section.table[0].CC,
                            SUB_CC: section.table[0].SUB_CC,
                            NAME: "",
                            POSITION: "Sub Total:",
                            ID: "",
                            ROOM: "",
                            AREA: "",
                            DATE: "",
                            SALARY: totalSalary.toFixed(2), // mantiene el formato con dos decimales

                        });
                        _tmp_.push(section);
                        if (index == (_data_.length - 1)) {
                            section.table.push({
                                CC: section.table[0].CC,
                                SUB_CC: "",
                                NAME: "",
                                POSITION: "TOTAL:",
                                ID: "",
                                ROOM: "",
                                AREA: "",
                                DATE: "",
                                SALARY: _total_.toFixed(2),
                            });
                        }
                    });


                    return _tmp_
                } catch (error) {

                    return null;
                }
            }
        },
        fn: {
            getKonvaStructure(node) {
                // node puede ser Stage, Layer o Group
                const obj = {
                    name: node.name() || null,
                    type: node.getClassName(),
                    children: []
                };

                if (node.getChildren && node.getChildren().length > 0) {
                    node.getChildren().forEach(child => {
                        obj.children.push(_HELPERS_.fn.getKonvaStructure(child));
                    });
                }

                return obj;
            },

            neonizeHex(hex) {
                // Quitar el # si existe
                hex = hex.replace(/^#/, "");

                // Convertir a RGB
                let r = parseInt(hex.substring(0, 2), 16) / 255;
                let g = parseInt(hex.substring(2, 4), 16) / 255;
                let b = parseInt(hex.substring(4, 6), 16) / 255;

                // Convertir RGB a HSL
                let max = Math.max(r, g, b), min = Math.min(r, g, b);
                let h, s, l = (max + min) / 2;
                if (max === min) {
                    h = s = 0;
                } else {
                    let d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }

                // Subir saturación y un poquito el brillo
                s = Math.min(1, s * 1.4); // 40% más saturado
                l = Math.min(1, l * 1.2); // 20% más brillante

                // Convertir HSL de vuelta a RGB
                let hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };

                let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                let p = 2 * l - q;
                r = hue2rgb(p, q, h);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h);

                // Convertir a Hex
                return "#" +
                    Math.round(r * 255).toString(16).padStart(2, "0") +
                    Math.round(g * 255).toString(16).padStart(2, "0") +
                    Math.round(b * 255).toString(16).padStart(2, "0");
            },
            lightenHex(hex, percent = 25) {
                // Remover el # si existe
                hex = hex.replace(/^#/, "");

                // Convertir a valores RGB
                let r = parseInt(hex.substring(0, 2), 16);
                let g = parseInt(hex.substring(2, 4), 16);
                let b = parseInt(hex.substring(4, 6), 16);

                // Aclarar cada canal RGB un porcentaje hacia 255
                r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
                g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
                b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

                // Convertir de nuevo a hex y devolver
                return "#" + [r, g, b]
                    .map(x => x.toString(16).padStart(2, "0"))
                    .join("");
            },
            DeepCopy(_data_) {
                const _get_data_ = JSON.parse(JSON.stringify(_data_));
                return Object.freeze(_get_data_);
            },
            setnametooltip(row, col) {
                let _return_ = "";
                switch (row + "," + col) {
                    case "1,1":
                        _return_ = "text_headcount_approved"
                        break;
                    case "1,2":
                        _return_ = "text_headcount_actual"
                        break;
                    case "1,2":
                        _return_ = "text_amount_approved"
                        break;
                    case "2,2":
                        _return_ = "text_amount_actual"
                        break;
                    default:
                        _return_ = ""
                        break;
                }
                return _return_;

            },



            resetPopupTable() {
                // Seleccionamos el .tbl_data dentro de #content_datatable
                const alto = d3.select("#content_datatable .tbl_data").node().offsetHeight;

                // Aplicamos el alto al contenedor
                d3.select("#content_datatable")
                    .style("height", (alto + 23 + 12) + "px");
            },


            esArrayNuloOVacio(_obj_) {
                return _obj_ === undefined || _obj_ === null || _obj_.length === 0;
            },
            _log({ data = null, title = "Data:" }) {
                if (!_HELPERS_.fn.esArrayNuloOVacio(data)) {
                    console.groupCollapsed(title)
                    console.log("%c" + data, "background-color:#026937; color:#fff");
                    console.groupEnd();
                } else {
                    console.log("%c undefined or null", "background-color:#ff0000; color:#fff");
                }
            },
            eliminarKeys(obj, keys) {
                const clavesAEliminar = Array.isArray(keys) ? keys : [keys];

                // Creamos una copia superficial del objeto para no modificar el original
                const nuevoObj = { ...obj };

                for (const key of clavesAEliminar) {
                    delete nuevoObj[key];
                }

                return nuevoObj;
            },
            CurrencyFormatted({
                locales = "en-US",
                symbolCurrency = "U$",
                alignsymbolCurrency = "normal",
                Rounded = true,
                number = 0
            }
            ) {
                // Formatear con comas para miles y punto decimal
                const formatter = new Intl.NumberFormat(locales, {
                    minimumFractionDigits: !Rounded ? 0 : 2,
                    maximumFractionDigits: !Rounded ? 0 : 2,
                });

                let _resp_ = String(formatter.format(parseFloat(number))).trim();
                let _spaces_ = " ";
                let total_Espacios = (alignsymbolCurrency === "left") ? (17 - parseInt(symbolCurrency.length + _resp_.length)) : 1;

                return (symbolCurrency !== null ? symbolCurrency + _spaces_.repeat(total_Espacios) : "") + _resp_;
            }
        },
        TableHTLML: {
            TablePath: "",
            DataTable: {},
            SetTablePath(_value_ = null) {

                if (_value_ !== null) {
                    if (String(this.TablePath).trim() == "") {
                        this.TablePath = _value_;
                    } else {
                        this.TablePath += " " + _value_;
                    }
                } else {
                    this.TablePath = "";
                }
                this.TablePath = String(this.TablePath).trim();


            },
            CreateTable(_layer_name_ = "void", _Data_ = null) {
                //d3.selectAll("#" + _layer_name_ + " .content_datatable").remove();
                this.SetTablePath();
                if (_Data_ !== null) {

                    this.SetTablePath("#" + _layer_name_);
                    this.DataTable = [];
                    this.DataTable = JSON.parse(JSON.stringify(_Data_));


                    if (d3.selectAll(this.TablePath + " #content_datatable").empty()) {
                        const contentStage = d3.select(this.TablePath);



                        const divCenter = contentStage.append("div")
                            .attr("id", "content_center");



                        divCenter.append("div")
                            .attr("id", "content_datatable")
                            .attr("class", "hide");
                        const divclose = divCenter.append("div")
                            .attr("class", "close-table");



                        this.SetTablePath("#content_center #content_datatable");
                        this.SetTABLE();
                        this.SetTHEAD();



                    } else {
                        this.SetTablePath();
                        this.SetTablePath("#" + _layer_name_ + " #content_datatable .tbl_data");
                    }
                    this.SetTBODY();
                    //this.SetTFOOT();
                }
            },
            SetTABLE() {

                const content_datatable = d3.select(this.TablePath);
                content_datatable.append("table")
                    .attr("class", "tbl_data");

                this.SetTablePath(".tbl_data");



            },
            SetTFOOT() {

                const _table_ = d3.select(this.TablePath);
                if (!_table_.selectAll("tfoot").empty()) {
                    _table_.selectAll("tfoot").remove();
                }
                _table_.append("tfoot");

                this.DataTable = _HELPERS_.data.CalculeSubTotal(this.DataTable);

                const GetDataOrder = this.GetDataOrder(this.DataTable);
                const _current_row_ = _HELPERS_.fn.eliminarKeys(GetDataOrder[GetDataOrder.length - 1], ["CC", "ORDER"])


                _current_row_.SALARY = _HELPERS_.fn.CurrencyFormatted({
                    symbolCurrency: "U$",
                    Rounded: true,
                    number: _current_row_.SALARY
                });




                this.SetRow("tfoot", _current_row_);






            },
            SetTBODY() {

                const _table_ = d3.select(this.TablePath);
                if (!_table_.selectAll("tbody").empty()) {
                    _table_.selectAll("tbody").remove();
                }
                _table_.append("tbody");



                this.DataTable = _HELPERS_.data.CalculeSubTotal(this.DataTable);



                const GetDataOrder = this.GetDataOrder(this.DataTable);




                let _SUB_CC_ = ""//GetDataOrder[0].SUB_CC;
                let counter_staff = 0;

                GetDataOrder.forEach((_row_, index) => {
                    if (_row_.POSITION !== "TOTAL:") {
                        const _current_row_ = _HELPERS_.fn.eliminarKeys(_row_, ["CC", "ORDER"])

                        _current_row_.SALARY = _HELPERS_.fn.CurrencyFormatted({
                            symbolCurrency: "U$",
                            Rounded: true,
                            number: _current_row_.SALARY
                        });


                        counter_staff = GetDataOrder.filter(row => row.SUB_CC === _current_row_.SUB_CC).length;
                        if (_SUB_CC_ !== _current_row_.SUB_CC) {

                            _current_row_.SUB_CC = _current_row_.SUB_CC + " (" + (counter_staff - 1) + ")";

                            if (_SUB_CC_ === "") {

                                this.SetRow("tbody", _current_row_);

                                if (counter_staff > 0) {

                                    _table_.select("tbody tr:nth-child(" + (index + 1) + ") td:first-child").attr("rowspan", counter_staff)
                                }
                            } else {
                                this.SetRow("tbody", _current_row_);
                                if (counter_staff > 0) {

                                    _table_.select("tbody tr:nth-child(" + (index + 1) + ") td:first-child").attr("rowspan", counter_staff)
                                }


                            }

                        } else {

                            this.SetRow("tbody", _HELPERS_.fn.eliminarKeys(_current_row_, ["SUB_CC"]));

                        }
                        _SUB_CC_ = _row_.SUB_CC;
                    }


                });




            },
            SetTHEAD() {

                const _table_ = d3.select(this.TablePath);
                _table_.append("thead");

                //const _thead_ = _table_.select(this.TablePath + " thead");

                this.SetRow("thead", {
                    "CC": "CC",
                    "NAME": "NAME",
                    "POSITION": "POSITION",
                    "ID": "ID",
                    "ROOM": "ROOM",
                    "AREA": "AREA",
                    "DATE": "DATE EMPLOYMENT",
                    "SALARY": "SALARY"
                });
                /*
                {
                                "CC": row[14],
                                "SUB_CC": row[13],
                                "NAME": row[0],
                                "POSITION": row[1],
                                "ID": row[2],
                                "ROOM": row[3],
                                "AREA": row[4],
                                "REPORTA": row[5],
                                "DATE": row[6],
                                "SALARY": Number(row[11]) / 12
                            }
                */



            },
            SetRow(_parent_ = null, _cells_ = null, rowspan = 0) {

                if (_parent_ !== null && _cells_ !== null) {
                    let print_class = false;

                    const _innerTable_ = d3.select(this.TablePath + " " + _parent_);
                    const _rows_ = _innerTable_.append("tr");
                    let _tag_row_, _tag_cell_ = "";


                    if (_cells_.POSITION === "Sub Total:") {
                        _rows_.attr("class", "row-subtotal");
                        print_class = true;
                    } else if (_cells_.POSITION === "TOTAL:") {

                        _cells_.SUB_CC = "";
                        _rows_.attr("class", "row-total");
                        print_class = true;
                    }


                    switch (_parent_) {
                        case "thead":
                            _tag_row_ = "tr";
                            _tag_cell_ = "th";

                            break;
                        case "tbody":
                            _tag_row_ = "tr:last-child";
                            _tag_cell_ = "td";
                            break;
                        case "tfoot":
                            _tag_row_ = "tr";
                            _tag_cell_ = "td";
                            break;
                        default:
                            break;
                    }

                    _innerTable_.select(_tag_row_)
                        .selectAll(_tag_cell_)
                        .data(Object.values(_cells_))
                        .enter()
                        .append(_tag_cell_)
                        .text(d => d)

                        .attr("class", (d, i, nodes) => {
                            // Chequeamos si es el último "td" que estamos creando
                            const isLast = i === nodes.length - 1;
                            const islabelSubTotal = ((i === 1 && d === "Sub Total:") || (i === 2 && d === "TOTAL:"));

                            // Arreglo para acumular clases
                            let clases = [];



                            if (islabelSubTotal) clases.push("sticky_label");
                            if (print_class && isLast) {
                                print_class = false;
                                clases.push("sticky_salary");
                            }


                            return (clases.length > 0) ? clases.join(" ") : null;
                        });

                }
            },
            GetDataOrder(_Json_) {


                try {
                    return _Json_.flatMap(item => item.table).map(({ CC, SUB_CC, NAME, POSITION, ID, ROOM, AREA, DATE, SALARY, ORDER }) => {

                        return {
                            CC: CC,
                            SUB_CC: SUB_CC,
                            NAME: NAME,
                            POSITION: POSITION,
                            ID: ID,
                            ROOM: ROOM,
                            AREA: AREA,
                            DATE: DATE,
                            SALARY: SALARY,
                            ORDER: ORDER
                        }
                    }).sort((a, b) => a.ORDER - b.ORDER);
                } catch (error) {
                    console.table(_Json_);
                }
            }
        }
        , Visual: {
            createCloseButton({
                x = 0,
                y = 0,
                width = 0,
                height = 0,
                radius = 8,
                backgroundColor = [["#DE5D5D", 0], ["#DE5D5D", 0.45], ["#911616", 0.51], ["#931D19", 0.75], ["#CC4E35", 1]],  // rojo claro
                stroke = '#6600007c',
                strokeWidth = 1.5,
                text = '✖',
                textColor = 'white',
                fontSize = 16,
            }) {


                const buttonShape = new Konva.Shape({
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    sceneFunc: function (ctx, shape) {

                        // console.log(_ANIMATION_.isRunning());
                        const r = radius;
                        ctx.beginPath();
                        ctx.moveTo(0, 0); // esquina sup izq (no redondeada)
                        ctx.lineTo(width, 0); // esquina sup der (no redondeada)
                        ctx.lineTo(width, height - r);
                        ctx.quadraticCurveTo(width, height, width - r, height); // inf der redondeada
                        ctx.lineTo(r, height);
                        ctx.quadraticCurveTo(0, height, 0, height - r); // inf izq redondeada
                        ctx.closePath();
                        // Degradado vertical rojo oscuro → claro
                        const gradient = ctx.createLinearGradient(0, 0, 0, height);
                        backgroundColor.forEach(colorSprite => {
                            gradient.addColorStop(colorSprite[1], colorSprite[0]);
                        });
                        //gradient.addColorStop(0, colorTop);
                        //gradient.addColorStop(1, colorBottom);
                        ctx.fillStyle = gradient;
                        ctx.fill();
                        ctx.strokeStyle = stroke;
                        ctx.lineWidth = strokeWidth;
                        ctx.stroke();

                    },
                });

                // Texto centrado
                const label = new Konva.Text({
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    text: text,
                    fontSize: fontSize,
                    fontStyle: 'bold',
                    fill: textColor,
                    align: 'center',
                    verticalAlign: 'middle',
                });

                // Crear grupo para manipularlo como un solo objeto
                const group = new Konva.Group({ x: x, y: y, name: "btn_close" });
                group.add(buttonShape, label);

                // Efecto hover

                group.on("click", (e) => {
                    const _btn_close_ = e.currentTarget;

                    //document.body.style.cursor = 'default';
                    _btn_close_.getParent().destroy();
                    _JSON_SLIDERS_.Settings.openModal = true;
                });
                /* group.on('pointerenter', () => {
                     console.log("entró");
                     document.body.style.cursor = "pointer";
                 });
                   group.on('pointerleave', () => {
                     document.body.style.cursor = 'default';
                     console.log("salió");
                 });*/


                return group;
            },
            CreateModal({ _name_ = "modal", _table_ = null, popupWidth = 0, popupHeight = 0 }) {

                if (_name_ !== "") {
                    let _contentHeight_ = popupHeight > _VIRTUAL_HEIGHT_ - 200 ? _VIRTUAL_HEIGHT_ - 320 : popupHeight;

                    const _containter_modal_ = new Konva.Group({
                        x: 0,
                        y: 0,
                        name: _name_,
                        /*clipFunc: function (ctx) {
                            ctx.rect(0, 0, popupWidth, _Height_); // define el área visible
                        }*/
                    });
                    const _bg_ = new Konva.Rect({
                        x: 0,
                        y: 0,
                        name: _name_ + "_bg",
                        width: _VIRTUAL_WIDTH_,
                        height: _VIRTUAL_HEIGHT_,
                        fill: "#252525ff",
                        opacity: 0.8,
                    });


                    const border = new Konva.Shape({
                        name: _name_ + "_border",
                        width: popupWidth,
                        height: _contentHeight_,
                        x: (_VIRTUAL_WIDTH_ / 2 - popupWidth / 2),
                        y: (_VIRTUAL_HEIGHT_ / 2 - _contentHeight_ / 2),
                        opacity: 0.5,
                        sceneFunc: function (ctx, shape) {

                            const backgroundColor = [
                                ["#d5ebf0", 0],
                                ["#D6FFFF", 0.45],
                                ["#a8effcff", 0.51],
                                ["#93e9f8ff", 0.75],
                                ["#4EB2D4", 1]
                            ];

                            // 🎨 Degradado vertical (azul → celeste)
                            const gradient = ctx.createLinearGradient(0, 0, 0, _contentHeight_);
                            backgroundColor.forEach(colorSprite => {
                                gradient.addColorStop(colorSprite[1], colorSprite[0]);
                            });

                            // 🎨 Sombra alrededor del contorno
                            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // color de sombra (negro semitransparente)
                            ctx.shadowBlur = 7;                    // intensidad del difuminado
                            ctx.shadowOffsetX = 0;                  // desplazamiento horizontal
                            ctx.shadowOffsetY = 0;                  // desplazamiento vertical


                            const r = 10; // radio de las esquinas

                            ctx.beginPath();
                            ctx.moveTo(r, 0); // inicio (arriba-izquierda, con espacio para el radio)

                            // 🔹 esquina superior derecha redondeada
                            ctx.lineTo(popupWidth - r, 0);
                            ctx.quadraticCurveTo(popupWidth, 0, popupWidth, r);

                            // 🔹 esquina inferior derecha redondeada
                            ctx.lineTo(popupWidth, _contentHeight_ - r);
                            ctx.quadraticCurveTo(popupWidth, _contentHeight_, popupWidth - r, _contentHeight_);

                            // 🔹 esquina inferior izquierda redondeada
                            ctx.lineTo(r, _contentHeight_);
                            ctx.quadraticCurveTo(0, _contentHeight_, 0, _contentHeight_ - r);

                            // 🔹 esquina superior izquierda redondeada
                            ctx.lineTo(0, r);
                            ctx.quadraticCurveTo(0, 0, r, 0);

                            ctx.closePath();
                            ctx.fillStyle = gradient;
                            ctx.fill();
                            ctx.strokeStyle = "#fff";
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        },
                    });

                    const r = 7;
                    const stroke = 'black';
                    const strokeWidth = 2;
                    const colorStart = '#b30e0e';   // azul fuerte
                    const colorEnd = '#fd7e7e';

                    // console.info(backgroundTable.y());

                    const btn_close = _HELPERS_.Visual.createCloseButton({
                        x: border.x() + border.width() - (70),
                        y: border.y(),
                        width: 60,
                        height: 25,
                    });
                    btn_close.cache()

                    // border.height(border.height() +30)
                    _containter_modal_.add(_bg_, border, /*backgroundTable,*/ btn_close);
                    border.cache();
                    if (_table_ !== null) {
                        _table_.y(border.y() + 30);
                        _containter_modal_.add(_table_);
                    }
                    return _containter_modal_

                }
            },

            __addCell({ text = "", color = "#000", width = 100, height = 30, x = 0, y = 0, fontSize = 14, fontFamily = _FONT_FAMILY_.font2, fill = "black", align = "center", verticalAlign = "middle", stroke = "red", strokeWidth = 1 }) {

                const cellGroup = new Konva.Group({ x: x, y: y });

                const rect = new Konva.Rect({
                    width: width,
                    height: height,
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                });
                const textNode = new Konva.Text({
                    x: 7,
                    text: text,
                    fontSize: fontSize,
                    fontFamily: fontFamily,
                    fill: color,
                    width: width - 14,
                    height: height,
                    align: align,
                    verticalAlign: verticalAlign,
                });
                cellGroup.add(rect);
                cellGroup.add(textNode);
                return cellGroup;
            },
            CalculeDisplacement(A, B, C, D, v) {
                // Calculamos la proporción relativa en A -> B
                const proportion = (v - A) / (B - A);

                // Aplicamos esa proporción a C -> D
                const result = C + proportion * (D - C);

                return result;
            },
            updateScroll(A, B, C, D, v) {
                const Displacement = (-1) * (_HELPERS_.Visual.CalculeDisplacement(A, B, C, D, v));
                return (Displacement);

            },
            __CreateTable({ _data_ = null, popupWidth = null, popupHeight = null }) {
                let _total_rows_ = 1;
                let _show_scrollbar_ = false;
                const cellHeight = 40;
                let _HeightTBodyContainer_ = 0;

                const table = new Konva.Group({
                    x: 10,
                    y: 0,
                    name: "theTable"
                });


                const tableBody = new Konva.Group({
                    x: 0,
                    y: cellHeight,
                    height: cellHeight,
                    name: "tableBody",

                });

                const tableBodyConteiner = new Konva.Group({
                    x: 0,
                    y: 0,

                    name: "tableBodyConteiner",

                });

                const tableHeaders = new Konva.Group({
                    x: 0,
                    y: 0,
                    height: cellHeight,
                    width: popupWidth,
                    name: "tableHeaders"
                });
                if (_data_ !== null) {
                    let startX = _VIRTUAL_WIDTH_ / 2 - (popupWidth / 2);
                    const startY = 0;//_VIRTUAL_HEIGHT_ / 2 - (popupHeight / 2) + 20;
                    const cellPadding = 0;
                    const fontSize = 16;
                    const fontFamily = _FONT_FAMILY_.font2;
                    let currentY = startY;
                    const headers = ["SUB_CC", "NAME", "POSITION", "ID", "ROOM", "AREA", "DATE EMPLOYMENT", "SALARY"];
                    const cellWidth = [260, 350, 260, 160, 220, 250, 120, 160];
                    const textAlign = ["left", "left", "left", "center", "left", "left", "center", "right"];
                    let _X_ = startX;
                    headers.forEach((header, index) => {
                        header = (header === "SUB_CC") ? "COST CENTER" : header;
                        const cell = _HELPERS_.Visual.__addCell({
                            text: header,
                            width: cellWidth[index],
                            height: cellHeight,
                            x: _X_,
                            y: currentY,
                            fontSize: fontSize,
                            fontFamily: fontFamily,
                            fill: "#026937",
                            color: "#fff",
                            align: "center",
                            verticalAlign: "middle",
                            stroke: "#026937",
                            strokeWidth: 1
                        });
                        tableHeaders.add(cell);
                        _X_ += (cellWidth[index] + cellPadding);
                    });


                    currentY = 0;
                    // Crear filas de datos
                    let _new_CostCenter_ = "";
                    var print_CostCenter = false;
                    let _total_ = 0;
                    _data_.forEach(section => {
                        section.table.forEach(row => {
                            _X_ = startX;
                            if (_new_CostCenter_ !== row["SUB_CC"]) {
                                print_CostCenter = true;
                                _new_CostCenter_ = String(row["SUB_CC"]).trim().toUpperCase();
                            }
                            headers.forEach((header, index) => {
                                header = header === "DATE EMPLOYMENT" ? "DATE" : (header === "COST CENTER" ? "SUB_CC" : header);
                                const _text_ = String(row[header] !== undefined ? row[header] : "").trim().toUpperCase();
                                if (header === "SUB_CC") {
                                    if (print_CostCenter) {
                                        const cell = _HELPERS_.Visual.__addCell({
                                            text: _text_,
                                            width: cellWidth[index],
                                            height: cellHeight * (section.table.length),
                                            x: _X_,
                                            y: currentY,
                                            fontSize: fontSize,
                                            fontFamily: fontFamily,
                                            fill: "#eef7f3ff",
                                            color: "#000",
                                            align: textAlign[index],
                                            verticalAlign: "middle",
                                            stroke: "#c2c2c2",
                                            strokeWidth: 0.5
                                        });
                                        tableBodyConteiner.add(cell);
                                        print_CostCenter = false;
                                    }

                                } else {

                                    const cell = _HELPERS_.Visual.__addCell({
                                        text: (header == "SALARY") ? _HELPERS_.fn.CurrencyFormatted({
                                            symbolCurrency: "U$",
                                            alignsymbolCurrency: "left",
                                            Rounded: true,
                                            number: _text_
                                        }) + "  "
                                            : _text_,
                                        width: cellWidth[index],
                                        height: cellHeight,
                                        x: _X_,
                                        y: currentY,
                                        fontSize: fontSize,
                                        fontFamily: fontFamily,
                                        fill: "#eef7f3ff",
                                        color: "#000",
                                        align: textAlign[index],
                                        verticalAlign: "middle",
                                        stroke: "#c2c2c2",
                                        strokeWidth: 0.5
                                    });
                                    tableBodyConteiner.add(cell);
                                }
                                _X_ += (cellWidth[index] + cellPadding);
                                if (header == "SALARY") {
                                    _total_ += Number(_text_);
                                    _total_rows_++;
                                }
                            });
                            currentY += cellHeight + cellPadding;


                        });



                    });


                    const cellTotal = _HELPERS_.Visual.__addCell({
                        text: "TOTAL: " + _HELPERS_.fn.CurrencyFormatted({
                            symbolCurrency: "U$",
                            Rounded: true,
                            alignsymbolCurrency: "left",
                            number: _total_
                        }) + "  ",
                        width: popupWidth - 20,
                        height: cellHeight,
                        x: startX,
                        y: currentY,
                        fontSize: fontSize,
                        fontFamily: fontFamily,
                        fill: "#eef7f3ff",
                        color: "#000",
                        align: "right",
                        verticalAlign: "middle",
                        stroke: "#c2c2c2",
                        strokeWidth: 0.5
                    });
                    currentY += cellHeight + cellPadding;
                    tableBodyConteiner.add(cellTotal);
                    if (_total_rows_ > 17) {
                        _HeightTBodyContainer_ = (17 * cellHeight);
                        _show_scrollbar_ = true;
                    } else {
                        _HeightTBodyContainer_ = (_total_rows_ * cellHeight)
                    }
                    if (_JSON_SLIDERS_.Settings.openModal === true) {

                        tableBody.clipFunc(function (ctx) {
                            ctx.rect(0, 0, popupWidth + 40, _HeightTBodyContainer_); // define el área visible
                        });
                        _JSON_SLIDERS_.Settings.openModal = false;

                    }
                    const _backGroundTable_ = new Konva.Rect(
                        {
                            x: startX,
                            y: tableHeaders.y(),
                            width: tableHeaders.width(),
                            fill: "#ffffff",
                            height: currentY
                        }
                    );

                    tableBody.add(_backGroundTable_, tableBodyConteiner);
                    table.add(tableHeaders, tableBody)
                    let scrollY = 0;
                    let lastTouchY = 0;

                    if (_show_scrollbar_ === true) {
                        /*------*/
                        // console.log(_total_rows_ * cellHeight, ">", _VIRTUAL_HEIGHT_ - 390);
                        let isDraggingThumb = false;

                        let thumbStartY = 0;
                        // === Tamaños ===
                        const containerHeight = _HeightTBodyContainer_;
                        const contentHeight = (_total_rows_ * cellHeight);

                        // === Scrollbar setup ===
                        const scrollTrackWidth = 10;
                        const scrollbarX = tableBody.width() - scrollTrackWidth - 5; // un poquito de margen
                        const scrollbarHeight = containerHeight;

                        //  console.log("_HeightTBodyContainer_", _HeightTBodyContainer_, "contentHeight", contentHeight);
                        const ConatinerScrollBar = new Konva.Group({
                            name: "ConatinerScrollBar",
                            x: startX + popupWidth - 30,
                            y: cellHeight,
                            width: scrollTrackWidth,
                            height: scrollbarHeight,

                        });


                        const scrollTrack = new Konva.Rect({
                            name: "scrollTrack",
                            x: 0,
                            y: 0,
                            width: scrollTrackWidth,
                            height: scrollbarHeight,
                            fill: '#c9c9c9',
                            opacity: 0.6,
                            cornerRadius: 5,
                        });

                        const scrollThumbHeight = Math.max((containerHeight / contentHeight) * scrollbarHeight, 30); // tamaño mínimo
                        const scrollThumb = new Konva.Rect({
                            name: "scrollThumb",
                            x: 0,
                            y: 0,
                            width: scrollTrackWidth,
                            height: scrollThumbHeight,
                            fill: '#007bff',
                            cornerRadius: 5,
                            draggable: true,


                        });



                        // Agregamos al mismo layer

                        // table.add(scrollThumb);


                        ConatinerScrollBar.add(scrollTrack, scrollThumb)
                        table.add(ConatinerScrollBar);
                        // === Función para actualizar contenido y thumb ===



                        // === Movimiento arrastrando el thumb ===
                        scrollThumb.on('dragstart', () => {
                            isDraggingThumb = true;
                            scrollY = scrollThumb.y();
                        });


                        let lastY = scrollThumb.y(); // guardamos la Y inicial

                        scrollThumb.on('dragmove', () => {
                            // let delta = 0;
                            scrollThumb.x(0); // mantiene la X fija
                            if (scrollThumb.y() < 0) {
                                scrollThumb.y(0);
                            } else if ((scrollThumb.y() + scrollThumb.height()) > scrollTrack.height()) {
                                scrollThumb.y(scrollTrack.height() - scrollThumb.height());
                            }

                            scrollY = _HELPERS_.Visual.updateScroll(0, scrollTrack.height() - scrollThumb.height(), 0, ((_total_rows_ - 17) * cellHeight), scrollThumb.y())
                            tableBodyConteiner.y(scrollY);
                            table.getLayer().batchDraw();
                        });

                        scrollThumb.on('dragend', () => {
                            isDraggingThumb = false;
                        });
                        /*------*/
                        tableBody.on('wheel', (e) => {
                            const containerHeight = currentY; // altura visible
                            const contentHeight = _HeightTBodyContainer_;
                            if (_HeightTBodyContainer_ < currentY) {
                                e.evt.preventDefault();
                                const delta = e.evt.deltaY;
                                const limitscroll = (containerHeight - contentHeight); // límite inferior
                                scrollY += 20 * (delta > 0 ? -1 : 1); // velocidad del scroll
                                if ((limitscroll) < Math.abs(scrollY)) {
                                    scrollY = (-limitscroll)
                                    // scrollY =limitscroll -10; 
                                    //return;
                                } else {
                                    if (scrollY <= 0) {
                                        tableBodyConteiner.y(scrollY);
                                    } else {
                                        scrollY = 0;
                                    }
                                }
                                scrollThumb.y(_HELPERS_.Visual.updateScroll(0, ((_total_rows_ - 17) * cellHeight), 0, scrollTrack.height() - scrollThumb.height(), scrollY));
                                table.getLayer().batchDraw();
                            }
                        }).on('touchstart', (e) => {
                            const touch = e.evt.touches[0];
                            lastTouchY = touch.clientY;
                        }).on('touchmove', (e) => {
                            e.evt.preventDefault();
                            if (_HeightTBodyContainer_ < currentY) {
                                const touch = e.evt.touches[0];
                                const deltaY = touch.clientY - lastTouchY;
                                lastTouchY = touch.clientY;
                                scrollY += deltaY;
                                if (scrollY <= 0 && scrollY >= -(_HeightTBodyContainer_ - currentY)) {
                                    tableBodyConteiner.y(scrollY);
                                } else if (scrollY > 0) {
                                    scrollY = 0;
                                } else if (scrollY < -(_HeightTBodyContainer_ - currentY)) {
                                    scrollY = -(_HeightTBodyContainer_ - currentY);
                                }
                                tableBodyConteiner.y(scrollY);
                                scrollThumb.y(_HELPERS_.Visual.updateScroll(0, ((_total_rows_ - 17) * cellHeight), 0, scrollTrack.height() - scrollThumb.height(), scrollY));
                                tableBody.getLayer().batchDraw();
                            }
                        }).on('touchend', () => {
                            lastTouchY = 0;
                        });

                    }
                }

                return {
                    table: table,
                    total_rows: _total_rows_ * cellHeight
                };

            },
            OpenDataTable(_layer_ = null, _data_ = null) {

                let popupWidth = 1800;
                let popupHeight = 150;

                const _grp_table_ = new Konva.Group({
                    x: 0,
                    y: 0,
                    name: "table",

                });

                const resultTable = _HELPERS_.Visual.__CreateTable({ _data_: _data_, popupWidth: popupWidth, popupHeight: popupHeight })
                _grp_table_.add(resultTable.table);

                //_layer_.add(_grp_table_);

                popupHeight = (resultTable.total_rows + (80));



                _layer_.add(_HELPERS_.Visual.CreateModal({ _name_: "modal_DataTable", _table_: _grp_table_, popupWidth: popupWidth, popupHeight: popupHeight }));

                //                console.log(JSON.stringify(_HELPERS_.fn.getKonvaStructure(_layer_), null, 2));
                //_layer_.batchDraw();


            },

            CreateYellows(_page_) {
                const _line_color_ = "#FF8300";
                let __direction__ = "";
                const __radius__ = 45;
                let lineWidth = 4
                const _lines_yellow_ = new Konva.Group({
                    x: 0,
                    y: 0,
                });
                const _points_ = [
                    [],
                    [],
                    [
                        [
                            800, 280,
                            650, 280,
                            650, 185,
                            430, 185
                        ],
                        [
                            1100, 280,
                            1250, 280,
                            1250, 185,
                            1470, 185
                        ]
                        ,
                        [
                            860, 800,
                            600, 800,
                            600, 200,
                            420, 200
                        ],
                        [
                            1040, 800,
                            1300, 800,
                            1300, 200,
                            1480, 200
                        ]
                    ]
                ];

                if (_points_[_page_] && _page_ == 2) {
                    _points_[_page_].forEach((_cood_, index) => {
                        if (_cood_) {
                            const line_dots = new Konva.Shape({
                                name: "line_dots",
                                sceneFunc: (ctx, shape) => {

                                    ctx.beginPath();
                                    ctx.moveTo(_cood_[0], _cood_[1]);
                                    if (_cood_[0] > _cood_[2]) {
                                        __direction__ = "right";
                                        ctx.lineTo(_cood_[2] + __radius__, _cood_[3]);
                                        ctx.arcTo(_cood_[2], _cood_[3], _cood_[2], _cood_[3] - __radius__, __radius__);
                                        ctx.lineTo(_cood_[4], _cood_[5] + __radius__);
                                        ctx.arcTo(_cood_[4], _cood_[5], _cood_[4] - __radius__, _cood_[5], __radius__);
                                    } else if (_cood_[0] < _cood_[2]) {
                                        __direction__ = "right";
                                        ctx.lineTo(_cood_[2] - __radius__, _cood_[3]);
                                        ctx.arcTo(_cood_[2], _cood_[3], _cood_[2], _cood_[3] - __radius__, __radius__);
                                        ctx.lineTo(_cood_[4], _cood_[5] + __radius__);
                                        ctx.arcTo(_cood_[4], _cood_[5], _cood_[4] + __radius__, _cood_[5], __radius__);
                                    }



                                    ctx.lineTo(_cood_[6], _cood_[7]);
                                    ctx.setLineDash([12, 6]);
                                    ctx.lineDashOffset = __dashOffset__;
                                    ctx.strokeStyle = _line_color_;
                                    ctx.lineWidth = lineWidth;
                                    ctx.stroke();


                                }

                            });
                            _lines_yellow_.add(line_dots);


                            //line_dots.cache();

                        }

                    }
                    );
                }



                return _lines_yellow_;
            },


        }
    }
    const _VIRTUAL_WIDTH_ = 1920;
    const _VIRTUAL_HEIGHT_ = 1080;

    const _WIDTH_TOOLTIPS_ = 360;
    const MIN_SCALE = 0.3;
    const MAX_SCALE = 3;


    function togglePantallaCompleta() {
        try {
            if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                const elem = document.documentElement;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        } catch (err) {
            console.error("Error al cambiar pantalla completa:", err);
        }
    }







    function normalizePadding(padding = []) {
        let top, right, bottom, left = 0;

        switch (padding.length) {
            case 1:
                top = right = bottom = left = padding[0];
                break;
            case 2:
                top = bottom = padding[0];
                right = left = padding[1];
                break;
            case 3:
                top = padding[0];
                right = left = padding[1];
                bottom = padding[2];
                break;
            case 4:
                [top, right, bottom, left] = padding;
                break;
            default:
                // Valor por defecto si no cumple con 1-4
                top = right = bottom = left = 0;
        }

        return {
            top: top,
            right: right,
            bottom: bottom,
            left: left
        };
    }



    function ResetTooltips(_boxToolTip_, nodo_values) {
        const _values_ = (nodo_values);

        try {

            /*
            console.groupCollapsed("tooltip")
            console.table(JSON.stringify(_values_, null, 2));
            console.groupEnd();
            */

            if (_values_.TooltipsValue !== undefined) {
                const text_headcount_approved = _boxToolTip_.findOne('.text_headcount_approved');
                if (_values_.TooltipsValue.headcount_approved !== undefined) {
                    text_headcount_approved.text(_HELPERS_.fn.CurrencyFormatted({ Rounded: false, symbolCurrency: null, number: _values_.TooltipsValue.headcount_approved }));
                }
                else {
                    text_headcount_approved.text(_HELPERS_.fn.CurrencyFormatted({ Rounded: false, symbolCurrency: null, number: 0 }));

                }


                const text_headcount_actual = _boxToolTip_.findOne('.text_headcount_actual');
                if (_values_.TooltipsValue.headcount_real !== undefined) {

                    text_headcount_actual.text(_HELPERS_.fn.CurrencyFormatted({ Rounded: false, symbolCurrency: null, number: _values_.TooltipsValue.headcount_real }));

                } else {
                    text_headcount_actual.text(_HELPERS_.fn.CurrencyFormatted({ Rounded: false, symbolCurrency: null, number: 0 }));

                }

            }


            if (_values_.TooltipsValue !== undefined) {
                const text_amount_actual = _boxToolTip_.findOne('.text_amount_actual');
                text_amount_actual.text(_HELPERS_.fn.CurrencyFormatted({ number: _values_.TooltipsValue.real }));
            }
        } catch (error) {
            console.error(error);
        }

    }

    function addRippleToGroup(group, { x = 0, y = 0 }) {
        const numCircles = 3;
        const delay = 350; // milisegundos entre ondas
        const duration = 2100; // duración total del ciclo
        const maxRadius = 20;
        const color = '#b70d0d';
        const rippleCircles = [];

        const startX = x - maxRadius / 2;
        const startY = maxRadius / 2;

        // 🔹 Crear las ondas
        for (let i = 0; i < numCircles; i++) {
            const circle = new Konva.Circle({
                x: startX,
                y: startY,
                radius: 0,
                fill: color,
                opacity: 1,
            });
            group.add(circle);
            rippleCircles.push(circle);
        }

        // 🔹 Iniciar animación controlada por Konva

        const anim = new Konva.Animation((frame) => {
            if (!frame) return;

            const now = frame.time;

            rippleCircles.forEach((circle, i) => {
                const localTime = (now - i * delay) % duration;
                if (localTime < 0) return; // todavía no inicia

                const t = localTime / duration;

                // Easing suave (easeInOutCubic)
                const ease = t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;

                circle.radius(maxRadius * ease);
                circle.opacity(1 - ease);
            });
        }, group.getLayer());

        anim.start(); // 🔥 inicia la animación


    }



    function InsertArrows(_arrow_ = null, width = 0, height = 0, color = "") {
        const _radius_ = 13;
        const _the_arrow_ = new Konva.Group();

        if (["top", "left", "right"].includes(String(_arrow_).toLowerCase())) {
            const triangle = new Konva.RegularPolygon({
                x: 0,
                y: 0,
                sides: 3,
                radius: (_radius_ / 2), // mitad de 15 para que ocupe 15px aprox
                fill: (_JSON_SLIDERS_.Settings.styles.lines || "#FF0000"),

            });
            switch (_arrow_) {
                case "top":
                    _the_arrow_.rotation(180);

                    _the_arrow_.x((width / 2));
                    _the_arrow_.y(-(_radius_ / 2));

                    break;
                case "left":
                    _the_arrow_.rotation(90);
                    _the_arrow_.x(-(_radius_ / 2));
                    _the_arrow_.y((height / 2));
                    break;
                case "right":
                    _the_arrow_.rotation(270);

                    _the_arrow_.x(width + (_radius_ / 2));
                    _the_arrow_.y((height / 2));


                    break;
                default:
                    break;
            }
            _the_arrow_.add(triangle);
        }




        return _the_arrow_;
    }
    function crearBox({
        x = null,
        y = null,
        lightenColor = null,
        text = null,
        link_slide = null,
        align = null,
        textsize = null,
        textColor = null,
        showSadow = null,
        cornerRadius = null,
        background = null,
        padding = null,
        newLine = null,
        width = null,
        height = null,
        maxWidth = null,
        minWidth = null,
        fontWidth = null,
        dataview = null,
        arrow = null,
        coord = null
    }) {


        x = (x === null) ? 0 : x;
        y = (y === null) ? 0 : y;
        lightenColor = (lightenColor === null) ? false : lightenColor;
        text = (text === null) ? null : text;
        link_slide = (link_slide === null) ? null : link_slide;
        align = (align === null) ? 'center' : 'align';
        textsize = (textsize === null) ? 17 : textsize;
        textColor = (textColor === null) ? '#ffffff' : textColor;
        showSadow = (showSadow === null) ? true : showSadow;
        cornerRadius = (cornerRadius === null) ? null : cornerRadius;
        background = (background === null) ? "#3B7302" : background; //"#0b7743",
        padding = (padding === null) ? [0] : padding;
        newLine = (newLine === null) ? false : newLine;
        width = (width === null) ? 0 : width;
        height = (height === null) ? 80 : height;
        maxWidth = (maxWidth === null) ? 500 : maxWidth;
        minWidth = (minWidth === null) ? 100 : minWidth;
        fontWidth = (fontWidth === null) ? "400" : fontWidth;
        dataview = (dataview === null) ? null : dataview;
        arrow = (arrow === null) ? null : arrow;
        coord = (coord === null) ? [] : coord;
        if (lightenColor) {
            background = _HELPERS_.fn.lightenHex(background)
        }

        const heightLine = 50;

        const group = new Konva.Group({
            x: x,
            y: y,
        });


        let current_link_slide = null;
        if (!_HELPERS_.fn.esArrayNuloOVacio(link_slide)) {
            current_link_slide = Number(link_slide.replace("page-", "")) - 1

        }
        group.setAttr("link_slide", {
            link_slide: current_link_slide
        });

        let _text_, tooltip, sumary = null;
        let _is_sub_level_ = false;

        if (text !== null) {
            _text_ = String(text).trim();
        }

        if (dataview !== null) {
            if (text === null) {
                _text_ = dataview.label;

            }
            tooltip = dataview.tooltip;
            sumary = dataview.sumary;
            _is_sub_level_ = dataview.is_sub_level;
        }

        _text_ = newLine ? String(_text_).replace(" ", '\n') : _text_;



        let _padding_ = normalizePadding(padding);
        let insert_alert = false;



        if (tooltip !== null) {
            const _nodo_values_ = _HELPERS_.fn.DeepCopy({
                TooltipsValue: tooltip
            });
            group.setAttr("nodo_values", _nodo_values_);

            if (!_HELPERS_.fn.esArrayNuloOVacio(_nodo_values_.TooltipsValue)) {
                insert_alert = _nodo_values_.TooltipsValue.headcount_approved < _nodo_values_.TooltipsValue.headcount_real ? true : false;
            }

        }



        group.setAttr("nodo_datatable", sumary);






        const _padding_vertical_ = (_padding_.top + _padding_.bottom);
        const _padding_horizontal_ = (_padding_.left + _padding_.right);

        const _height_relative_ = ((height) < textsize ? textsize : height) + _padding_vertical_;//= Math.abs(OBJ_text.height() - (textsize * 0.16));

        const OBJ_text = new Konva.Text({
            name: "innetText",
            lineHeight: 1.2,

            fontSize: textsize,
            height: _height_relative_,
            y: (textsize * 0.06),
            x: 0,
            width: ((width > maxWidth ? maxWidth : (width < minWidth ? minWidth : width))) + _padding_horizontal_,
            text: _text_,
            fontFamily: _FONT_FAMILY_.font1,
            fontStyle: fontWidth,
            fill: textColor,
            perfectDrawEnabled: false,
            align: align,
            wrap: "word",
            verticalAlign: "middle"
        });

        const _new_width_ = OBJ_text.width() + _padding_horizontal_;

        const _width_box_ = _new_width_ < minWidth ? minWidth : (_new_width_ > maxWidth ? maxWidth : _new_width_);



        const rect = new Konva.Rect({
            name: "obj_rect",
            width: _width_box_,
            height: _height_relative_,
            fill: background,
            cornerRadius: cornerRadius ? cornerRadius : _height_relative_ / 2,



        });




        /*  if (showSadow) {
              rect.shadowColor("#000000");
              rect.shadowBlur(20);
              rect.shadowOffsetX(4);
              rect.shadowOffsetY(4);
              rect.shadowOpacity(0.3);
          }
  */




        rect.offsetX(rect.width() / 2);
        rect.offsetY(rect.height() / 2);

        // Reajustar la posición para que el centro quede donde querés
        rect.position({
            x: rect.x() + rect.offsetX(),
            y: rect.y() + rect.offsetY()
        });

        group.on("click", (e) => {
            const _grp_ = e.currentTarget;
            const link_slide = _grp_.getAttr('link_slide');
            if (!_HELPERS_.fn.esArrayNuloOVacio(link_slide.link_slide)) {
                const current_index = link_slide.link_slide;
                UpdatePageActive(link_slide.link_slide);
                $("#sliders .slide").addClass("hide");
                $("#sliders .slide").each(function (index, element) {
                    if (current_index === index) {
                        $(this).removeClass("hide");
                    }
                });
            }
            else {
                const _layer_ = _grp_.getLayer();// .getParent().getParent();
                if (!_HELPERS_.fn.esArrayNuloOVacio(sumary)) {
                    //content = stage.content
                    const nodo_datatable = _HELPERS_.fn.DeepCopy(_grp_.getAttr("nodo_datatable"));
                    let _DATA_TABLE_ = Object.freeze(JSON.parse(JSON.stringify(nodo_datatable)));


                    if (_DATA_TABLE_ !== null && _JSON_SLIDERS_.Settings.showTable) {
                        //_HELPERS_.TableHTLML.CreateTable(_layer_.name(), _DATA_TABLE_);
                        //_HELPERS_.fn.resetPopupTable();

                        if (_JSON_SLIDERS_.Settings.openModal === true) {

                            _HELPERS_.Visual.OpenDataTable(_layer_, _DATA_TABLE_);
                        }
                    }


                }
                else {



                }

            }




        });


        group.on("mouseenter", (e) => {
            let bkcolorHover = "#FF8300";
            const _grp_ = e.currentTarget;

            const _layer_ = _grp_.getLayer();
            if (tooltip !== null && dataview !== null) {
                const _boxToolTip_ = _layer_.findOne('.TheTooltip');

                const box = _grp_;
                const parentNode = _grp_.getParent();


                const __nodo_values__ = _HELPERS_.fn.DeepCopy(_grp_.getAttr('nodo_values'));
                ResetTooltips(_boxToolTip_, __nodo_values__);

                if (!_HELPERS_.fn.esArrayNuloOVacio(__nodo_values__.TooltipsValue)) {
                    bkcolorHover = __nodo_values__.TooltipsValue.headcount_approved < __nodo_values__.TooltipsValue.headcount_real ? "#731022" : bkcolorHover;
                }
                const _CurrentX_ = box.x() + parentNode.x();
                const _CurrentY_ = box.y() + parentNode.y();
                const _CurrentW_ = (box.findOne('.obj_rect').width());
                const _CurrentH_ = (box.findOne('.obj_rect').height());

                if (_CurrentX_ - ((_CurrentW_) / 2) < 100) {
                    _boxToolTip_.offsetX(0);
                    _boxToolTip_.findOne(".arrow_bottom").x(200 * (-1));

                } else if (_CurrentX_ + ((_CurrentW_)) > 1800) {
                    _boxToolTip_.offsetX(_boxToolTip_.findOne('.bk_tooltip').width() - 80);
                    _boxToolTip_.findOne(".arrow_bottom").x(200);
                } else {
                    _boxToolTip_.offsetX(_WIDTH_TOOLTIPS_ / 2);

                    _boxToolTip_.findOne(".arrow_bottom").x(0);
                }
                //console.log("_VIRTUAL_WIDTH_",_VIRTUAL_WIDTH_," X:", _CurrentX_ + ((_CurrentW_)))
                _boxToolTip_.x((_CurrentX_ + ((_CurrentW_) / 2)) - 42);
                _boxToolTip_.y(_CurrentY_ - 20);

                _boxToolTip_.to({
                    opacity: 1,
                    duration: 0.2
                });


            }

            const rectDentroDelGroup = _grp_.findOne('.obj_rect');
            rectDentroDelGroup.to({
                scaleX: 1.1,
                scaleY: 1.1,
                fill: bkcolorHover,
                duration: 0.2,
                cursor: "pointer"
            });

        });

        group.on("mouseleave", (e) => {
            const _grp_ = e.currentTarget;
            const rectDentroDelGroup = _grp_.findOne('.obj_rect');
            const _layer_ = _grp_.getLayer();
            const _boxToolTip_ = _layer_.findOne('.TheTooltip');

            _boxToolTip_.to({

                opacity: 0,
                duration: 0.2
            });

            rectDentroDelGroup.to({
                scaleX: 1,
                scaleY: 1,
                fill: background,
                duration: 0.2
            });

        });
        OBJ_text.width(rect.width())

        const _line_Vertical = new Konva.Line({
            points: [
                (rect.width() / 2), -15,
                (rect.width() / 2), (rect.height() + 15),
            ],
            name: "lineVertical",
            stroke: "#ff0000",
            strokeWidth: 1,
            lineCap: "round",
            lineJoin: "round"
        });


        const _line_Horizontal = new Konva.Line({
            points: [
                -15, (rect.height() / 2),
                (rect.width() + 15), (rect.height() / 2),
            ],
            name: "lineHorizontal",
            stroke: "#ff0000",
            strokeWidth: 1,
            lineCap: "round",
            lineJoin: "round"
        });



        group.add(rect);



        if ($("body").hasClass("lines")) {
            group.add(_line_Vertical, _line_Horizontal);

        }


        group.add(OBJ_text);


        if (insert_alert) {
            addRippleToGroup(group, {
                x: rect.width()
            });
        }

        if (arrow) {
            group.add(InsertArrows(arrow, rect.width(), rect.height()));
        }




        /*
            name: rect.name(),
            x: group.x(),
            y: group.y(),
        }, null, 2));*/
        return group;

    }


    function create_Menu(show = true) {
        if (!d3.select(".submenu").empty()) {
            d3.select(".submenu").classed("hide", false)
            return;
        }
        _JSON_SLIDERS_.Pages.forEach((page) => {
            const container = document.getElementById(page.slug);
            if (!container) return;

            const padre = container.parentElement.parentElement.parentElement.parentElement.parentElement;
            if (!padre) return;

            // Revisar si el padre ya tiene submenu
            let _submenu_ = d3.select(padre).select(".submenu");




            if (_submenu_.empty()) {
                _submenu_ = d3.select(padre)
                    .append("div")
                    .attr("class", "submenu");

            }

            // Revisar si el submenu ya tiene UL
            let _ul_ = _submenu_.select("ul");
            if (_ul_.empty()) {
                _ul_ = _submenu_.append("ul");
            }

            // Buscar el stage de Konva
            const stage = Konva.stages.find(s => s.container() === container);

            if (stage && stage.width() > 0) {
                const _li_ = _ul_.append("li");


                _li_.classed(page.slug, true);
                if (page.active === true) {
                    _li_.classed("active", true);
                }

                const _img = _li_.append("img");

                stage.findOne(".action_buttons").opacity(0);





                const _base64_ = exportStageToThumbnail(stage, 1);
                _img.attr("src", _base64_);
                stage.findOne(".action_buttons").opacity(1);

                _li_.append("span")
                    .attr("class", "lastUpdated_print").text("Last updated on: " + _JSON_SLIDERS_.Settings.lastUpdated);

            }

        });

        if (!show) {
            d3.select(".submenu").classed("hide", true)
        }

        d3.selectAll(".submenu").on("click", function (event) {
            // Si el click fue exactamente en el div.submenu
            if (event.target === this) {
                d3.select(".submenu").classed("hide", true)

                console.log("submenu eliminado");
            }
        });

        d3.selectAll(".submenu li").on("click", function (event) {
            // Si el click fue exactamente en el div.submenu
            const _the_page_ = String(d3.select(this).attr("class")).replace("active", "").trim();

            d3.select(".submenu").classed("hide", true)


            $(".slide").addClass("hide");

            $(".submenu li").removeClass("active");
            d3.select(this).classed("active", true)

            $("#" + _the_page_).parent().removeClass("hide");
            UpdatePageActive(Number(_the_page_.replace("page-", "")) - 1);


        });

    }




    function resizeStage(_str_ = "") {

        try {
            _JSON_SLIDERS_.Pages.forEach((page, index) => {
                const container = document.getElementById(page.slug);
                const containerWidth = container.clientWidth;
                const containerHeight = container.clientHeight;
                const scaleX = containerWidth / _VIRTUAL_WIDTH_;
                const scaleY = containerHeight / _VIRTUAL_HEIGHT_;
                const scale = Math.min(scaleX, scaleY);
                const _stage_ = Konva.stages.find(s => s.container() === container);
                if (_stage_ && _stage_.width() > 0) {

                    _stage_.width(_VIRTUAL_WIDTH_ * scale);
                    _stage_.height(_VIRTUAL_HEIGHT_ * scale);
                    _stage_.scale({ x: scale, y: scale });
                    _stage_.draw();

                }
            });
        } catch (error) {
            console.error("Error: ", error);
        }


    }

    function exportStageToThumbnail(stage, scaleFactor = 0.25) {
        // Asegurarse que el stage tenga dimensiones válidas
        const originalWidth = stage.width();
        const originalHeight = stage.height();

        if (originalWidth === 0 || originalHeight === 0) {
            console.warn('Stage sin tamaño válido.');
            return null;
        }

        // Crear un nuevo canvas temporal
        const thumbnailCanvas = document.createElement('canvas');
        const ctx = thumbnailCanvas.getContext('2d');

        // Definir tamaño reducido
        const thumbWidth = originalWidth * scaleFactor;
        const thumbHeight = originalHeight * scaleFactor;

        thumbnailCanvas.width = thumbWidth;
        thumbnailCanvas.height = thumbHeight;

        // Dibujar en el canvas temporal
        ctx.drawImage(
            stage.toCanvas(),
            0, 0, originalWidth, originalHeight,  // src
            0, 0, thumbWidth, thumbHeight         // destino
        );

        // Obtener la imagen en base64
        const dataURL = thumbnailCanvas.toDataURL({
            mimeType: "image/png",
            pixelRatio: 2
        });
        return dataURL;
    }

    function CreateContainer(drawGrid = false, name = "grid_Pattern") {
        const _Grid_ = {
            width: Math.floor(_VIRTUAL_WIDTH_ / 100) * 100,
            height: (Math.floor(_VIRTUAL_HEIGHT_ / 100) * 100) - 50,
            x: (_VIRTUAL_WIDTH_ / 2) - ((Math.floor(_VIRTUAL_WIDTH_ / 100) * 100) / 2),
            y: 70
        }
        const _grid_Pattern_ = new Konva.Group({
            name: name,
            width: _Grid_.width,
            height: _Grid_.height,
            x: _Grid_.x,
            y: _Grid_.y,

        });
        if (drawGrid) {

            const backgroundRect = new Konva.Rect({
                x: 0, // Relative to the group's origin
                y: 0, // Relative to the group's origin
                width: _Grid_.width, // Desired width of the background
                height: _Grid_.height, // Desired height of the background
                fill: "#FFFFFF", // Background color
                opacity: 0.1,
                // other styling properties like stroke, cornerRadius, etc.
            });
            _grid_Pattern_.add(backgroundRect);


            for (let _x_ = 0; _x_ <= _Grid_.width + 1; _x_ += 10) {
                _grid_Pattern_.add(new Konva.Line({
                    points: [_x_, 0, _x_, _Grid_.height],
                    stroke: (_x_ % 100 === 0) ? "#0d702e" : (_x_ % 50 === 0) ? "#0d702e" : "#26be59",
                    strokeWidth: (_x_ % 100 === 0) ? 2 : 1,
                    lineCap: "round",
                    lineJoin: "round",
                    opacity: 0.5
                }));



            }
            for (let _y_ = 0; _y_ <= _Grid_.height + 1; _y_ += 10) {

                _grid_Pattern_.add(new Konva.Line({
                    points: [0, _y_, _Grid_.width, _y_],
                    stroke: (_y_ % 100 === 0) ? "#0d702e" : (_y_ % 50 === 0) ? "#0d702e" : "#26be59",
                    strokeWidth: (_y_ % 100 === 0) ? 2 : 1,
                    lineCap: "round",
                    lineJoin: "round",
                    opacity: 0.5
                }));
            }
        }
        return (_grid_Pattern_);
    }

    function cargarImagenBase64(base64) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = base64;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    }

    // Función async que podés llamar donde ocupés
    async function agregarImagenAlLayer(_Constainer_ = null, base64, x = 0, y = 0, width = 100, height = 100) {
        try {
            const imagenCargada = await cargarImagenBase64(base64);

            const konvaImage = new Konva.Image({
                image: imagenCargada,
                x: x,
                y: y,
                width: width,
                height: height,
                listening: false,// opcional, si no querés que capture eventos
                offsetY: 0,
                offsetW: 0,
                listening: true
            });
            if (_Constainer_) {


                _Constainer_.add(konvaImage);
                // _Constainer_.draw();
            }
        } catch (err) {
            console.error("Error cargando la imagen base64:", err);
        }
    }
    function returnIcon(name, icon, size, x = 0, y = 0, opacity = 0.3) {

        const btn_icon = new Konva.Group({
            name: name,
            x: x + size / 2,
            y: y + size / 2,
            width: size,
            height: size,
            opacity: opacity,
            offsetX: size / 2,
            offsetY: size / 2,
            fill: 'transparent'
        }).on("mouseenter", (e) => {

            const _grp_ = e.currentTarget;

            _grp_.to({
                scaleX: 1.1,
                scaleY: 1.1,
                opacity: 1,
                duration: 0.2,
                cursor: "pointer"
            });

        }).on("mouseleave", (e) => {
            const _grp_ = e.currentTarget;



            _grp_.to({
                scaleX: 1,
                scaleY: 1,
                opacity: _grp_.name() == "btn_home" ? 1 : 0.3,
                duration: 0.2,
                cursor: "pointer"
            });

        }).on("click", (e) => {
            const _grp_ = e.currentTarget;

            switch (_grp_.name()) {



                case "btn_layers":

                    _JSON_SLIDERS_.Pages.forEach((page) => {
                        if (page.active) {

                            const container = document.getElementById(page.slug);
                            const stage = Konva.stages.find(s => s.container() === container);

                            create_Menu();
                        }
                    });


                    break;
                case "btn_screenshot":


                    _JSON_SLIDERS_.Pages.forEach((page) => {

                        if (page.active) {
                            const container = document.getElementById(page.slug);
                            const stage = Konva.stages.find(s => s.container() === container);

                            copyStageToClipboard(stage, page.slug);
                        }
                    });
                    break;
                case "btn_print":

                    _JSON_SLIDERS_.Pages.forEach((page) => {
                        if (page.active) {




                            create_Menu(false);

                            d3.select(".submenu").classed("hide", true);

                            setTimeout(function () {
                                window.print();

                            }, 500);


                        }
                    });




                    break;
                case "btn_presentation":

                    togglePantallaCompleta()


                    break;

                default:
                    break;
            }



        });



        agregarImagenAlLayer(btn_icon, icon, 0, 0, size, size);

        return btn_icon;
    }

    function inserToolBar() {

        const diametro = 36;
        let _width_container_ = 0;

        const _ToolBar_ = new Konva.Group({
            name: "toolbar",
            x: 0,
            y: 0,
            offsetX: 0,
            offsetY: 0,
            width: _VIRTUAL_WIDTH_,
            opacity: 0.8

        }).on("mouseenter", (e) => {

            const _grp_ = e.currentTarget;

            _grp_.to({

                opacity: 1,
                duration: 0.2,
                easing: Konva.Easings.EaseInOut
            });

        }).on("mouseleave", (e) => {
            const _grp_ = e.currentTarget;



            _grp_.to({
                scaleX: 1,
                scaleY: 1,
                opacity: _grp_.name() == "btn_home" ? 1 : 0.8,
                easing: Konva.Easings.EaseInOut,
                duration: 0.2,
            });

        });
        const _backGround_ = new Konva.Rect({
            x: 0,
            y: 0,
            name: "ToolbarBk",
            width: 100,
            height: 100,
            fill: "#062540",
            opacity: 0.3,
            cornerRadius: diametro


        });

        _ToolBar_.add(_backGround_);

        [
            "layers",
            "screenshot",
            "print",
            "presentation"
        ].forEach((_icon_, _index_) => {
            const _separator_ = 13;
            let _Position_X_ = (diametro + _separator_) * _index_;
            let _Position_Y_, _New_Diameter_ = 0;
            /*if (_icon_ === "layers") {
                _Position_X_ = _Position_X_
                _New_Diameter_ = diametro + (diametro * 0.60);
                _Position_Y_ = -((_New_Diameter_ - diametro) / 2);
                _ToolBar_.add(returnIcon("btn_" + _icon_, IMAGES.icons[_icon_], _New_Diameter_, _Position_X_ - _separator_, _Position_Y_, 1));
 
            } else */
            {
                _ToolBar_.add(returnIcon("btn_" + _icon_, IMAGES.icons[_icon_], diametro, _Position_X_, _Position_Y_));
            }
            _width_container_ = _Position_X_ + diametro;
        });


        const ToolbarPadding = 8;
        _backGround_.width(_width_container_ + ToolbarPadding);
        _backGround_.height(diametro + ToolbarPadding);
        _backGround_.x(-(ToolbarPadding / 2));
        _backGround_.y(-(ToolbarPadding / 2));
        _ToolBar_.y(_VIRTUAL_HEIGHT_ - 60);
        _ToolBar_.width(_width_container_);
        _ToolBar_.x(_VIRTUAL_WIDTH_ / 2 - _ToolBar_.width() / 2);




        return _ToolBar_;
    }

    function UpdatePageActive(current_page = 0) {
        _JSON_SLIDERS_.Pages.forEach(page => {
            page.active = false;
        });

        _JSON_SLIDERS_.Pages[current_page].active = true;


        if (current_page == 2) {
            _ANIMATION_.start();
        } else {
            _ANIMATION_.stop();
        }
    }
    function CreateButtonActions(_page_ = 0) {


        const BtnActions = new Konva.Group({
            name: "action_buttons",
            x: 0,
            y: 0,
            offsetX: 0,
            offsetY: 0,
            width: _VIRTUAL_WIDTH_,
            height: _VIRTUAL_HEIGHT_

        });


        // BtnActions.x(_VIRTUAL_WIDTH_ - (_width_container_ + 25))

        // Grupo que contiene el círculo + flecha
        const radius = 45;
        const arrowBtn = new Konva.Group({
            x: 0,
            y: (30 + radius),

        });
        if (_page_ > 0) {




            // Círculo de fondo
            const circle = new Konva.Circle({
                radius: radius,
                fill: "#199137",
                shadowColor: "black",
                shadowBlur: 5,
                shadowOpacity: 0.3
            });
            arrowBtn.add(circle);

            // Flecha izquierda (usamos carácter unicode ←)

            const arrow = new Konva.Text({
                text: "←",   // flecha izquierda
                fontSize: radius - (radius * 0.10),
                fontFamily: "Calibri",
                fill: "white",
                align: "center",
                verticalAlign: "middle",
                width: 50,
                height: 50
            });
            arrow.offsetX(arrow.width() / 2);
            arrow.offsetY(arrow.height() / 2);
            arrow.position({ x: 0, y: 0 });
            arrowBtn.add(arrow);


            arrowBtn.x(_VIRTUAL_WIDTH_ - (arrowBtn.width() + 100));
            arrowBtn.y(150);


            // Evento de click
            arrowBtn.on("click", () => {

                $(".slide").addClass("hide");
                $("#page-1").parent().removeClass("hide");

                UpdatePageActive(0);
            });

        }


        return BtnActions.add(arrowBtn, inserToolBar());



    }

    function CreateBackgound() {
        const _bk_Layer_ = new Konva.Group({
            name: "_layout_",
            x: 0,
            y: 0
        });
        const border = new Konva.Rect({
            name: "bkcolor",
            x: 0,
            y: 0,
            width: _VIRTUAL_WIDTH_,
            height: _VIRTUAL_HEIGHT_,
            fill: '#FFFFFF'
        });

        _bk_Layer_.add(border);


        return _bk_Layer_;
    }



    function scalePathTo(path, targetWidth, targetHeight) {
        // Obtiene el bounding box actual del path
        const box = path.getClientRect({ relativeTo: path.getLayer() });

        const scaleX = targetWidth / box.width;
        const scaleY = targetHeight / box.height;

        // Aplica escala
        path.scale({ x: scaleX, y: scaleY });

        return path;
    }
    function InserBannerTop(width = _VIRTUAL_WIDTH_, height = 60) {
        var _Constainer_Banner_ = new Konva.Group({
            x: 0,
            y: 0,
        });

        const _backGround_ = new Konva.Rect({
            width: width,
            height: height,
            x: 0,
            y: 0,
            fill: "#0c783d"
        });

        const _oval_ = new Konva.Path({
            x: _VIRTUAL_WIDTH_ * 0.03,
            y: 0,
            data: "m47.63 0-.182.004C7.746 1.587 0 14.817 0 14.817h115.094v-.003C95.933 5.2 81.476.407 60.738 0Z",
            fill: '#7ebc41',
        });

        scalePathTo(_oval_, _VIRTUAL_WIDTH_ * 0.30, height);


        const _backGround_border = new Konva.Rect({
            width: (_VIRTUAL_WIDTH_),
            height: height * 0.30,
            x: 0,
            y: (height - (height * 0.30)) + 1,
            fill: "#f4821f"
        });

        /* var _logo_ = new Konva.Path({
             x: 20,
             y: 20,
             data: IMAGES.logo,
             fill: '#026937',
         });
         scalePathTo(_logo_, height + (height * 0.20), height + (height * 0.20));
 */
        //_Constainer_Banner_.add(_backGround_);


        var path = new Konva.Path({
            x: 0,
            y: 0,
            data: IMAGES.stripes,
            fill: '#000000',
            opacity: 0.3,
        });

        scalePathTo(path, _VIRTUAL_WIDTH_, height);


        _Constainer_Banner_.add(_backGround_, _oval_, path, _backGround_border, _logo_);
        return _Constainer_Banner_;
    }
    function InsertLastUpdate({ text = null }) {
        if (text === null) {
            ""
        } else {
            text = "Last updated on: " + text;
        }


        const texto = new Konva.Text({
            x: 0,          // Posición horizontal
            y: 2,
            name: "last_updated",
            text: text,// Contenido del texto
            fontSize: 17,   // Tamaño de fuente
            fontWeight: 600,// Grosor de la fuente
            fontFamily: _FONT_FAMILY_.font2, // Tipo de letra
            fill: "#768FA6",   // Color del texto
            padding: 7,    // Espacio interno
            align: "right",// Alineación horizontal
            draggable: false, // Permite arrastrar el texto
            perfectDrawEnabled: false,

        });



        const _bg_ = new Konva.Rect({
            width: (_VIRTUAL_WIDTH_),
            height: texto.height(),
            x: 0,
            y: 0,
            name: "bk_updated_date",
            fill: "#dfdfdf",
        });

        const content_text = new Konva.Group({
            x: 0,
            y: _VIRTUAL_HEIGHT_ - (_bg_.height()),
        });

        texto.width(_bg_.width() - 220);
        content_text.add(_bg_, texto);

        return content_text;
    }


    function returnStyle({
        text = "",
        fontStyle = "700",
        x = 0,
        y = 0,
        fontFamily = _FONT_FAMILY_.font2,
        fontSize = 19,
        fill = "#ffffff",
        align = "left",
        wrap = "word",
        verticalAlign = "middle",
        name = "caption_real",
        height = 30,
    }) {
        return {
            text: text,
            fontStyle: fontStyle,
            x: x,
            y: y,
            fontFamily: fontFamily,
            perfectDrawEnabled: false,
            fontSize: fontSize,
            fill: fill,
            align: align,
            wrap: wrap,
            verticalAlign: verticalAlign,
            name: name,
            height: height,
        }
    }
    function CreateTooltip() {
        // Grupo principal
        const backgroundColor = "#03395A";

        const hightTooltip = 120;
        const strokeWidth = 4
        const tableGroup = new Konva.Group({
            x: 50,
            y: 50,
            name: "TheTooltip",
            listening: false,
            offsetX: (_WIDTH_TOOLTIPS_ + strokeWidth) / 2,
            offsetY: hightTooltip,
            opacity: 0
        });

        // Fondo con esquinas redondeadas y sombra
        const bg = new Konva.Rect({
            width: _WIDTH_TOOLTIPS_,
            height: hightTooltip,
            name: "bk_tooltip",
            fill: backgroundColor,
            cornerRadius: 15,
            shadowColor: "black",
            shadowBlur: 10,
            shadowOpacity: 0.3,
            stroke: "#fff",
            strokeWidth: strokeWidth
        });
        tableGroup.add(bg);

        // Datos de la tabla
        const headers = ["", "APPROVED", "ACTUAL"];
        const rows = [
            ["HEADCOUNT", "0", "0"],
            ["SALARY", "", ""]
        ];

        // Estilos
        const cellWidth = 150;
        const cellHeight = 40;
        const fontSize = 16;
        const textColor = "#fff";
        const lineColor = "rgba(255, 255, 255, 0.3)";

        // Dibujar las celdas
        for (let row = 0; row < rows.length + 1; row++) {
            for (let col = 0; col < headers.length; col++) {
                let textValue = row === 0 ? headers[col] : rows[row - 1][col];

                const text = new Konva.Text({
                    x: col * cellWidth,
                    y: row * cellHeight,
                    name: _HELPERS_.fn.setnametooltip(row, col),
                    width: cellWidth,
                    height: cellHeight,
                    text: textValue,
                    fontSize: (row === 1 && col > 0) ? fontSize + 5 : fontSize,
                    fontFamily: _FONT_FAMILY_.font2,
                    fill: textColor,
                    align: "center",
                    verticalAlign: "middle"
                });
                tableGroup.add(text);

                // Dibujar líneas verticales
                if (col > 0) {
                    const vLine = new Konva.Line({
                        points: [col * cellWidth, 0, col * cellWidth, cellHeight * (rows.length + 1)],
                        stroke: lineColor,
                        strokeWidth: 1
                    });
                    tableGroup.add(vLine);
                }
            }
            // Dibujar líneas horizontales
            if (row > 0) {
                const hLine = new Konva.Line({
                    points: [0, row * cellHeight, cellWidth * headers.length, row * cellHeight],
                    stroke: lineColor,
                    strokeWidth: 1
                });
                tableGroup.add(hLine);
            }
        }

        // Ajustar fondo al contenido
        bg.width(cellWidth * headers.length);
        bg.height(cellHeight * (rows.length + 1));

        // === FLECHA TRIÁNGULO ===
        const arrowSize = 30; // ancho de la base
        const arrowHeight = 25; // altura del triángulo

        const arrow = new Konva.Line({
            points: [
                (bg.width() / 2) - (arrowSize / 2), bg.height() - 5,
                (bg.width() / 2), bg.height() + arrowHeight - 5,
                (bg.width() / 2) + (arrowSize / 2), bg.height() - 5
            ],
            name: "arrow_bottom",
            fill: backgroundColor,
            closed: true,
            shadowColor: "black",
            shadowBlur: 10,
            shadowOpacity: 0.3
        });

        tableGroup.add(arrow);

        return tableGroup;



    }




    function returnDataToolTip(_boxToolTip_ = null) {

        return ((_HELPERS_.fn.esArrayNuloOVacio(_boxToolTip_)) ? null : _boxToolTip_)
    }
    function findNodeByLabel(data, searchLabel) {
        for (const node of data) {
            if (node.label && node.label.trim() === searchLabel) {
                return node; // Encontrado
            }
            if (node.table && Array.isArray(node.table)) {
                const found = findNodeByLabel(node.table, searchLabel);
                if (found) return found;
            }
        }
        return null; // No encontrado
    }
    function findRowByLabel(_data_, labelToFind, sub_level = false) {
        let _Data_temp_ = null;
        let _return_ = null;
        if (!_HELPERS_.fn.esArrayNuloOVacio(_data_)) {

            for (const item in _data_) {

                if (_data_[item].label === labelToFind) {
                    //if (labelToFind === "LIBRARY STAFF") {

                    if (sub_level === true) {
                        let __SALARY__ = _data_[item].table.reduce((sum, row) => {
                            const salary = parseFloat(row.SALARY || "0");
                            return sum + (isNaN(salary) ? 0 : salary);
                        }, 0);
                        _Data_temp_ = {
                            label: _data_[item].label,

                            tooltip: _data_[item].tooltip,
                            table:
                                [{
                                    label: _data_[item].label,
                                    note: null,
                                    tooltip: {
                                        headcount: _data_[item].table.length,
                                        approved: __SALARY__,
                                        real: __SALARY__,

                                    },
                                    table: _data_[item].table
                                }]
                        }
                    } else {
                        _Data_temp_ = _data_[item];
                    }

                    //}

                    break;
                }

            }
        }


        _return_ = _Data_temp_
        return (!_HELPERS_.fn.esArrayNuloOVacio(_return_)) ? {
            label: (String(_return_.label).trim()).toUpperCase(),
            is_sub_level: sub_level,
            tooltip: returnDataToolTip(_return_.tooltip),
            sumary: returnSumary(_return_.table),
            table: _return_.table
        } : {
            label: (String(labelToFind).trim()).toUpperCase(),
            is_sub_level: sub_level,
            tooltip: null,
            sumary: null,
            table: null
        };;
        /*const _return_ = findNodeByLabel(_data_, labelToFind);
    
        */

    }
    function returnSumary(_tables_, label = null) {
        let _ARRAY_ = [];
        if (label === "print") {
            _ARRAY_.push(_tables_);

        } else {
            _ARRAY_ = _tables_;
        }
        if (!_HELPERS_.fn.esArrayNuloOVacio(_ARRAY_)) {
            return _ARRAY_.map(row => {
                return {
                    label: row.label,
                    tooltip: row.tooltip,
                    table: row.table
                }
            })
        } else {
            return null;
        }


    }
    function getDeepestNodeCount(obj) {
        if (!obj || typeof obj !== "object") return 0;
        if (!obj.children || typeof obj.children !== "object") return 1;
        return 1 + getDeepestNodeCount(obj.children);
    }

    function RestructureNodes({ _NODE_PARENT_ = null, _level_ = 1, siblings = 0 }) {

        if (_NODE_PARENT_) {
            let _width_contentBubbles_ = _VIRTUAL_WIDTH_ - 20
            if (_level_ == 1) {
                let TotalNode = getDeepestNodeCount(_NODE_PARENT_)
                //console.log("TotalNode", TotalNode);
                //console.error("_NODE_PARENT_", JSON.stringify(_NODE_PARENT_, null, 2))
                _NODE_PARENT_.x = (_width_contentBubbles_ / 2) - (_NODE_PARENT_.width / 2);
                _NODE_PARENT_.y = 20;
                _NODE_PARENT_.children = RestructureNodes({
                    _NODE_PARENT_: _NODE_PARENT_.children,
                    _level_: _level_ + 1,
                    siblings: (_NODE_PARENT_.children) ? _NODE_PARENT_.children.length : 0
                })
                //console.log(JSON.stringify(_NODE_PARENT_, null, 2));
            } else {
                if (siblings > 1) {
                    let HasChildren = false;
                    _NODE_PARENT_.forEach(BrotherNode => {
                        HasChildren
                    });
                }
            }
        }
        return _NODE_PARENT_;
    }
    /*function GetAllNodes(_number_page_) {
        let _Nodes_ = [];
        _Nodes_[0] = [
            {
                text: "BOD",
                x: 0,
                y: 0,
                width: 200,
                height: 80,
                textsize: 48,
                fontWidth: "700",
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,
                newLine: false,
                link_slide: null,
                dataview: null,
                arrow: null,
                children: [
                    
                    {
                        text: "DIRECTOR GENERAL",
                        x: 0,
                        y: 0,
                        width: 360,
                        height: 60,
                        textsize: 28,
                        fontWidth: "700",
                        background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                        newLine: false,
                        link_slide: null,
                        dataview: null,

                        arrow: {
                            coord: null
                        },
                        dataview: null,
                        children: [],
                        position: "center"
                    },
                    {
                        text: "COMPLIANCE",
                        x: 1385,
                        y: 140,
                        width: 200,
                        height: 60,
                        textsize: 20,
                        fontWidth: null,
                        background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                        newLine: true,
                        link_slide: null,
                        coord: {
                            begin: { x: 1130, y: 170 },
                            end: { x: 1375, y: 170 }
                        },
                        dataview: findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "COMPLIANCE"),
                        children: [],
                        position: "left"
                    }]
            }
        ]

        return (_Nodes_[_number_page_]) ? RestructureNodes(_Nodes_[_number_page_][0]) : null;

    }
    */
    
    function GetAllNodes(_number_page_) {
        const _Nodes_ = [];
        //__TAG__ = _JSON_SLIDERS_.data["ADMINISTRATION"];


        _Nodes_[0] = [
            {
                text: "BOD",
                x: 850,
                y: 20,
                width: 200,
                height: 80,
                textsize: 48,
                fontWidth: "700",
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,
                newLine: false,
                link_slide: null,
                dataview: null
            },
            
            {
                text: "DIRECTOR GENERAL",
                x: 770,
                y: 140,
                width: 360,
                height: 60,
                textsize: 28,
                fontWidth: "700",
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: false,
                link_slide: null,
                dataview: null,

                coord: {
                    begin: { x: 950, y: 100 },
                    end: { x: 950, y: 130 }
                },
                dataview: null
            },


            {
                text: "COMPLIANCE",
                x: 1385,
                y: 140,
                width: 200,
                height: 60,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: null,


                coord: {
                    begin: { x: 1130, y: 170 },
                    end: { x: 1375, y: 170 }
                },


                dataview: findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "COMPLIANCE")
            },
            {

                text: "PRIMARY SCHOOL",
                x: 20,
                y: 270,
                width: 150,
                height: null,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: "page-3",
                coord: {
                    begin: { x: 950, y: 200 },
                    end: { x: 95, y: 260 }
                },

            },
            {
                text: "SECONDARY SCHOOL",
                x: 210,
                y: 270,
                width: 150,
                height: null,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: "page-3",

                coord: {
                    begin: { x: 285, y: 230 },
                    end: { x: 285, y: 260 }
                },
                dataview: null
            },
            {
                text: "ATHLETICS",
                x: 400,
                y: 270,
                width: 150,
                height: null,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: null,

                coord: {
                    begin: { x: 475, y: 230 },
                    end: { x: 475, y: 260 }
                },

                dataview: findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "ATHLETICS")
            },
            {
                text: "ATHLETICS DIRECTOR",
                x: 400,
                y: 390,
                width: 150,
                height: null,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel2,//,
                newLine: true,
                link_slide: null,

                coord: {
                    begin: { x: 475, y: 350 },
                    end: { x: 475, y: 380 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "ATHLETICS").sumary, "ATHLETICS DIRECTOR", true)
            },
            {
                text: "SECRETARY",
                x: 460,
                y: 510,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//,
                newLine: true,
                link_slide: null,

                coord: {
                    begin: { x: 430, y: 470 },
                    end: { x: 450, y: 540 }
                },
                // DB & SUPPORT SERVICES, ATHLETICS, ATHLETICS SECRETARY
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "ATHLETICS").sumary, "ATHLETICS SECRETARY", true)
            }

            ,
            {
                text: "PHYSICAL EDUCATION",
                x: 460,
                y: 610,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 430, y: 530 },
                    end: { x: 450, y: 640 }



                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "ATHLETICS").sumary, "PHYSICAL EDUCATION", true)
            }


            ,
            {
                text: "TECHNOLOGY",
                x: 590,
                y: 270,
                width: 150,
                height: null,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 665, y: 230 },
                    end: { x: 665, y: 260 }



                },
                dataview: findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "TECHNOLOGY")
            },
            {
                text: "TECHNOLOGY DIRECTOR",
                x: 590,
                y: 390,
                width: 150,
                height: null,
                textsize: null,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel2,//,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 665, y: 350 },
                    end: { x: 665, y: 380 }



                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "TECHNOLOGY").sumary, "TECHNOLOGY DIRECTOR", true)
            },
            {
                text: "IT SUPPORT",
                x: 650,
                y: 510,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 620, y: 470 },
                    end: { x: 640, y: 540 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "TECHNOLOGY").sumary, "IT SUPPORT", true)
            },
            {
                text: "ED TECH",
                x: 650,
                y: 610,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 620, y: 530 },
                    end: { x: 640, y: 640 }



                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "TECHNOLOGY").sumary, "ED TECH", true)

            },
            {
                text: "WEB DEVELOPER",
                x: 650,
                y: 710,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 620, y: 630 },
                    end: { x: 640, y: 740 }
                },

                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "TECHNOLOGY").sumary, "WEB DEVELOPER", true)

            },

            {
                text: "RECORDS",
                x: 780,
                y: 270,
                width: 150,
                height: null,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: null,


                coord: {
                    begin: { x: 855, y: 230 },
                    end: { x: 855, y: 260 }



                },
                dataview: findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "RECORDS")
            },
            {
                text: "ADMISSIONS",
                x: 970,
                y: 270,
                width: 150,
                height: 80,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: null,


                coord: {
                    begin: { x: 1045, y: 230 },
                    end: { x: 1045, y: 260 }



                },
                dataview: findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "ADMISSIONS")
            },
            {
                text: "ADMISSIONS DIRECTOR",
                x: 970,
                y: 390,
                width: 150,
                height: 80,
                textsize: null,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel2,//null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1045, y: 350 },
                    end: { x: 1045, y: 380 }



                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "ADMISSIONS").sumary, "ADMISSIONS DIRECTOR", true)
            }, {
                text: "ADMISSIONS ASSISTANT",
                x: 1030,
                y: 510,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1000, y: 470 },
                    end: { x: 1020, y: 540 }



                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "ADMISSIONS").sumary, "ADMISSIONS ASSISTANT", true)
            },
            {
                text: "MARKETING",
                x: 1160,
                y: 270,
                width: 150,
                height: 80,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1235, y: 230 },
                    end: { x: 1235, y: 260 }
                },
                dataview: findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "MARKETING")
            },


            {
                text: "MARKETING DIRECTOR",
                x: 1160,
                y: 390,
                width: 150,
                height: null,
                textsize: null,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel2,//null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1235, y: 350 },
                    end: { x: 1235, y: 380 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "MARKETING").sumary, "MARKETING DIRECTOR", true)
            },

            {
                text: "COMMUNICATIONS",
                x: 1220,
                y: 510,
                width: 240,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1190, y: 470 },
                    end: { x: 1210, y: 540 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "MARKETING").sumary, "COMMUNICATIONS", true)
            },


            {
                text: "DIGITAL MEDIA",
                x: 1280,
                y: 610,

                width: 180,
                height: 50,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel4,// null,
                newLine: false,
                link_slide: null,
                coord: {
                    begin: { x: 1250, y: 530 },
                    end: { x: 1270, y: 635 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "MARKETING").sumary, "DIGITAL MEDIA", true)

            },
            {
                text: "PHOTOGRAPHER",
                x: 1280,
                y: 700,
                width: 180,
                height: 50,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel4,//null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1250, y: 610 },
                    end: { x: 1270, y: 725 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "MARKETING").sumary, "PHOTOGRAPHER", true)

            },


            {
                text: "EVENTS PLANNIG & LOGISTICS",
                x: 1220,
                y: 790,
                width: 240,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1190, y: 530 },
                    end: { x: 1210, y: 820 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "MARKETING").sumary, "EVENTS PLANNIG & LOGISTICS", true)
            },


            {
                text: "INSTITUTIONAL ADVANCEMENT MANAGER",
                x: 1220,
                y: 890,
                width: 240,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1190, y: 810 },
                    end: { x: 1210, y: 920 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "MARKETING").sumary, "INSTITUTIONAL ADVANCEMENT MANAGER", true)
            },




            {
                text: "CLINIC",
                x: 1350,
                y: 270,
                width: 150,
                height: 80,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1425, y: 230 },
                    end: { x: 1425, y: 260 }
                },
                dataview: findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "CLINIC")
            },
            {
                text: "HR",
                x: 1540,
                y: 270,
                width: 150,
                height: 80,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1615, y: 230 },
                    end: { x: 1615, y: 260 }
                },
                dataview: findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "HR")
            },


            {
                text: "HR DIRECTOR",
                x: 1540,
                y: 390,
                width: 150,
                height: null,
                textsize: null,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel2,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1615, y: 350 },
                    end: { x: 1615, y: 380 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "HR").sumary, "HR DIRECTOR", true)
            },
            {
                text: "HR STAFF",
                x: 1600,
                y: 510,
                width: 140,
                height: 60,
                textsize: null,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1570, y: 470 },
                    end: { x: 1590, y: 540 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "HR").sumary, "HR STAFF", true)
            },
            {
                text: "BUSINESS DIRECTOR",
                x: 1730,
                y: 270,
                width: 150,
                height: null,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: "page-2",
                coord: {
                    begin: { x: 950, y: 200 },
                    end: { x: 1805, y: 260 }





                },
                dataview: null
            }


        ];

        _Nodes_[1] = [
            {
                text: "BOD",
                x: 850,
                y: 20,
                width: 200,
                height: 80,
                textsize: 48,
                fontWidth: "700",
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: false,
                link_slide: null,
                dataview: null
            },
            {
                text: "DIRECTOR GENERAL",
                x: 770,
                y: 140,
                width: 360,
                height: 60,
                textsize: 28,
                fontWidth: "700",
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//#06511F",
                newLine: false,
                link_slide: null,
                coord: {
                    begin: { x: 950, y: 100 },
                    end: { x: 950, y: 130 }
                },
                dataview: null
            },
            {
                text: "BUSINESS DIRECTOR",
                x: 790,
                y: 240,
                width: 320,
                height: 80,
                textsize: 25,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: false,
                link_slide: null,
                coord: {
                    begin: { x: 950, y: 200 },
                    end: { x: 950, y: 230 }
                },
                dataview: null
            },

            {
                text: "ACCOUNTING",
                x: 105,
                y: 390,
                width: 150,
                height: null,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 950, y: 320 },
                    end: { x: 180, y: 380 }
                },
                dataview: findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "ACCOUNTING")
            },

            {
                text: "HEAD ACCOUNTING",
                x: 105,
                y: 510,
                width: 150,
                height: null,
                textsize: null,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel2,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 180, y: 470 },
                    end: { x: 180, y: 500 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "ACCOUNTING").sumary, "HEAD ACCOUNTING", true)
            },
            {
                text: "ACCOUNTING STAFF",
                x: 160,
                y: 620,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 135, y: 590 },
                    end: { x: 155, y: 650 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "ACCOUNTING").sumary, "ACCOUNTING STAFF", true)

            },


            {
                text: "TREASURY",
                x: 325,
                y: 390,
                width: 150,
                height: 80,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,// "#06511F",
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 400, y: 350 },
                    end: { x: 400, y: 380 }
                },
                dataview: findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "TREASURY")

            },
            {
                text: "TREASURER",
                x: 325,
                y: 510,
                width: 150,
                height: 80,
                textsize: null,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel2,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 400, y: 470 },
                    end: { x: 400, y: 500 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "TREASURY").sumary, "TREASURER", true)
            },
            {
                text: "ACCOUNTS PAYABLE",
                x: 380,
                y: 620,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 355, y: 590 },
                    end: { x: 375, y: 650 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "TREASURY").sumary, "ACCOUNTS PAYABLE", true)
            },



            {
                text: "ACCOUNTS RECEIVABLE",
                x: 380,
                y: 710,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 355, y: 640 },
                    end: { x: 375, y: 740 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "TREASURY").sumary, "ACCOUNTS RECEIVABLE", true)

            },



            {

                text: "CASHIER & STAFF",
                x: 380,
                y: 800,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 355, y: 720 },
                    end: { x: 375, y: 830 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "TREASURY").sumary, "CASHIER & STAFF", true)

            },
            {

                text: "DATA ANALYST",
                x: 380,
                y: 890,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 355, y: 820 },
                    end: { x: 375, y: 920 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "TREASURY").sumary, "DATA ANALYST", true)

            },

            {


                text: "PURCHASING",
                x: 545,
                y: 390,
                width: 150,
                height: 80,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 620, y: 350 },
                    end: { x: 620, y: 380 }
                },
                dataview: findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "PURCHASING")
            },
            {
                text: "PURCHASING OFFICER",
                x: 545,
                y: 510,
                width: 150,
                height: 80,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel2,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 620, y: 470 },
                    end: { x: 620, y: 500 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "PURCHASING").sumary, "PURCHASING OFFICER", true)
            },
            {
                text: "PURCHASING STAFF",
                x: 600,
                y: 620,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 575, y: 590 },
                    end: { x: 595, y: 650 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "PURCHASING").sumary, "PURCHASING STAFF", true)
            },


            {
                text: "WAREHOUSE",
                x: 600,
                y: 710,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 575, y: 640 },
                    end: { x: 595, y: 740 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "PURCHASING").sumary, "WAREHOUSE", true)

            },
            {
                text: "COPY CENTER",
                x: 600,
                y: 800,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 575, y: 720 },
                    end: { x: 595, y: 830 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "PURCHASING").sumary, "COPY CENTER", true)
            },
            {

                text: "TIGER STORE",
                x: 765,
                y: 390,
                width: 150,
                height: 80,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 840, y: 350 },
                    end: { x: 840, y: 380 }
                },
                dataview: findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "TIGER STORE")

            },
            {
                text: "MANAGER",
                x: 765,
                y: 510,
                width: 150,
                height: 80,
                textsize: null,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel2,//null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 840, y: 470 },
                    end: { x: 840, y: 500 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "TIGER STORE").sumary, "MANAGER", true)
            },
            {

                text: "CLERK",
                x: 820,
                y: 620,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 795, y: 590 },
                    end: { x: 815, y: 650 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "TIGER STORE").sumary, "CLERK", true)
            },




            {
                text: "OFFICE ASSISTANT",
                x: 985,
                y: 390,
                width: 150,
                height: 80,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1060, y: 350 },
                    end: { x: 1060, y: 380 }
                },
                dataview: findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "OFFICE ASSISTANT")
            },

            {
                text: "ELI",
                x: 1205,
                y: 390,
                width: 150,
                height: 80,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1280, y: 350 },
                    end: { x: 1280, y: 380 }
                },
                dataview: findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "ELI")
            },


            {
                text: "ASSETS",
                x: 1425,
                y: 390,
                width: 150,
                height: 80,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1500, y: 350 },
                    end: { x: 1500, y: 380 }
                },
                dataview: findRowByLabel(_JSON_SLIDERS_.data["ADMINISTRATION"], "ASSETS")
            },



            {
                text: "FACILITIES",
                x: 1645,
                y: 390,
                width: 150,
                height: 80,
                textsize: 20,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,// "#06511F",
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 950, y: 320 },
                    end: { x: 1720, y: 380 }
                },
                dataview: findRowByLabel(_JSON_SLIDERS_.data["FACILITIES"], "FACILITIES")
            },
            {
                text: "FACILITIES MANAGER",
                x: 1645,
                y: 510,
                width: 150,
                height: 80,
                textsize: null,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel2,//null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1720, y: 470 },
                    end: { x: 1720, y: 500 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["FACILITIES"], "FACILITIES").sumary, "FACILITIES MANAGER", true)

            },
            {
                text: "FACILITIES STAFF",
                x: 1705,
                y: 620,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1675, y: 590 },
                    end: { x: 1695, y: 650 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["FACILITIES"], "FACILITIES").sumary, "FACILITIES STAFF", true)

            },
            {
                text: "MAINTENANCE",
                x: 1705,
                y: 710,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: true,
                link_slide: null,

                coord: {
                    begin: { x: 1675, y: 630 },
                    end: { x: 1695, y: 740 }
                },

                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["FACILITIES"], "FACILITIES").sumary, "MAINTENANCE", true)

            },
            {
                text: "SECURITY",
                x: 1705,
                y: 800,
                width: 130,
                height: 60,
                textsize: 15,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1675, y: 720 },
                    end: { x: 1695, y: 830 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["FACILITIES"], "FACILITIES").sumary, "SECURITY", true)

            },



        ];

        _Nodes_[2] = [
            {
                text: "BOD",
                x: 850,
                y: 20,
                width: 200,
                height: 80,
                textsize: 48,
                fontWidth: "700",
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: false,
                link_slide: null,

                dataview: null
            },
            {
                text: "DIRECTOR GENERAL",
                x: 770,
                y: 140,
                width: 360,
                height: 60,
                textsize: 28,
                fontWidth: "700",
                background: _JSON_SLIDERS_.Settings.styles.colorLevel1,//"#06511F",
                newLine: false,
                link_slide: null,
                coord: {
                    begin: { x: 950, y: 100 },
                    end: { x: 950, y: 130 }
                },
                dataview: null
            },

            {

                text: "SPECIALIZED LEARNING DIRECTOR",
                x: 800,
                y: 240,
                width: 300,
                height: 80,
                fontWidth: null,
                textsize: 25,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//"#06511F",
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 950, y: 200 },
                    end: { x: 950, y: 230 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["SPECIALIZED LEARNING LEAD"], "SPECIALIZED LEARNING LEAD").sumary, "SPECIALIZED LEARNING DIRECTOR", true)



            },
            {

                text: "PRIMARY SPECIALIZED LEARNING LEADS",
                x: 630,
                y: 400,
                width: 300,
                height: 60,
                fontWidth: null,
                textsize: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//null,
                newLine: true,
                coord: {
                    begin: { x: 950, y: 320 },
                    end: { x: 780, y: 390 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["SPECIALIZED LEARNING LEAD"], "SPECIALIZED LEARNING LEAD").sumary, "PRIMARY SCHOOL", true)

            },
            {
                text: "SECONDARY SPECIALIZED LEARNING LEADS",
                x: 970,
                y: 400,
                width: 300,
                height: 60,
                fontWidth: null,
                textsize: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//null,
                newLine: true,
                link_slide: null,
                coord: {
                    type: "top-bottom",
                    begin: { x: 950, y: 320 },
                    end: { x: 1120, y: 390 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["SPECIALIZED LEARNING LEAD"], "SPECIALIZED LEARNING LEAD").sumary, "SECONDARY SCHOOL", true)

            },
            {
                text: "PARAPROFESSIONAL",
                x: 885,
                y: 540,
                width: 200,
                height: 60,
                fontWidth: null,
                textsize: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel4,//null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1120, y: 460 },
                    end: { x: 985, y: 530 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["SPECIALIZED LEARNING LEAD"], "SECONDARY SCHOOL").sumary, "PARAPROFESSIONAL", true)
            },
            {
                text: "PRIMARY SCHOOL PRINCIPAL",
                x: 175,
                y: 130,
                width: 250,
                height: 80,
                fontWidth: null,
                textsize: 20,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel2,// "#06511F",
                newLine: true,
                link_slide: null,
                coord: {
                    type: "right-left",
                    begin: { x: 770, y: 170 },
                    end: { x: 430, y: 170 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["PRIMARY SCHOOL"], "PRIMARY SCHOOL").sumary, "PRINCIPAL", true)
            },
            {
                text: "ASISTANT PRINCIPAL",
                x: 175,
                y: 240,
                width: 250,
                height: 60,
                fontWidth: null,
                textsize: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//  null,
                newLine: false,
                link_slide: null,
                coord: {

                    begin: { x: 300, y: 210 },
                    end: { x: 300, y: 230 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["PRIMARY SCHOOL"], "PRIMARY SCHOOL").sumary, "ASISTANT PRINCIPAL", true)
            },
            {
                text: "PRIMARY LEADS",
                x: 175,
                y: 340,
                width: 250,
                height: 60,
                fontWidth: null,
                textsize: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: false,
                link_slide: null,
                coord: {
                    begin: { x: 300, y: 300 },
                    end: { x: 300, y: 330 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["PRIMARY SCHOOL"], "PRIMARY SCHOOL").sumary, "PRIMARY LEADS", true)

            },
            {
                text: "FACULTY",
                x: 210,
                y: 440,
                height: 60,
                width: 180,
                fontWidth: null,
                textsize: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//  null,
                newLine: true,
                link_slide: null,
                showSadow: false,
                coord: {
                    begin: { x: 300, y: 400 },
                    end: { x: 300, y: 430 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["PRIMARY SCHOOL"], "PRIMARY SCHOOL").sumary, "FACULTY", true)
            },
            {
                text: "SUBSTITUTES",
                x: 50,
                y: 540,
                width: 180,
                height: 40,
                textsize: 14,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel4,// null,
                newLine: true,
                link_slide: null,
                showSadow: false,
                coord: {
                    begin: { x: 300, y: 500 },
                    end: { x: 140, y: 530 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["PRIMARY SCHOOL"], "PRIMARY SCHOOL").sumary, "SUBSTITUTE TEACHERS", true)
            },
            {
                text: "PARAPROFESSIONALS",
                x: 370,
                y: 540,
                width: 180,
                height: 40,
                textsize: 14,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel4,// null,
                newLine: true,
                link_slide: null,
                showSadow: false,
                coord: {
                    type: "top-bottom",
                    begin: { x: 300, y: 500 },
                    end: { x: 460, y: 530 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["PARAPROFESSIONAL"], "PARAPROFESSIONAL").sumary, "PARAPROFESSIONAL", true)

            },
            {

                text: "DIRECTOR OF LEADERSHIPS & ENRICHMENT",
                x: 210,
                y: 620,
                width: 180,
                height: 80,
                fontWidth: null,
                textsize: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 300, y: 500 },
                    end: { x: 300, y: 610 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["PRIMARY SCHOOL"], "PRIMARY SCHOOL").sumary, "DIRECTOR OF LEADERSHIP & ENRICHMENT", true)

            },
            {

                text: "COUNSELORS",
                x: 210,
                y: 740,
                width: 180,
                height: 60,
                fontWidth: null,
                textsize: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//  null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 300, y: 700 },
                    end: { x: 300, y: 730 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["PRIMARY SCHOOL"], "PRIMARY SCHOOL").sumary, "COUNSELOR", true)
            },
            {
                text: "SECRETARIES",
                x: 210,
                y: 840,
                width: 180,
                height: 60,
                fontWidth: null,
                textsize: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//  null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 300, y: 800 },
                    end: { x: 300, y: 830 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["PRIMARY SCHOOL"], "PRIMARY SCHOOL").sumary, "SECRETARIES", true)






            },
            {
                text: "SECONDARY SCHOOL PRINCIPAL",
                x: 1475,
                y: 130,
                width: 250,
                height: 80,
                fontWidth: null,
                textsize: 20,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel2,//  "#06511F",
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1130, y: 170 },
                    end: { x: 1470, y: 170 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["SECONDARY SCHOOL"], "SECONDARY SCHOOL").sumary, "PRINCIPAL", true)

            }, {
                text: "ASISTANT PRINCIPAL",
                x: 1475,
                y: 240,
                width: 250,
                height: 60,
                fontWidth: null,
                textsize: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: false,
                link_slide: null,
                coord: {
                    begin: { x: 1600, y: 210 },
                    end: { x: 1600, y: 230 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["SECONDARY SCHOOL"], "SECONDARY SCHOOL").sumary, "PRINCIPAL", true)





            },
            {
                text: "SECONDARY INSTRUCTIONAL COACH",
                x: 1475,
                y: 340,
                width: 250,
                height: 60,
                fontWidth: null,
                textsize: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,//  null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1600, y: 300 },
                    end: { x: 1600, y: 330 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["SECONDARY SCHOOL"], "SECONDARY SCHOOL").sumary, "SECONDARY INSTRUCTIONAL COACH", true)


            },
            {
                text: "FACULTY",
                x: 1510,
                y: 440,
                width: 180,
                height: 60,
                fontWidth: null,
                textsize: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: true,
                link_slide: null,
                showSadow: false,
                coord: {
                    begin: { x: 1600, y: 400 },
                    end: { x: 1600, y: 430 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["SECONDARY SCHOOL"], "SECONDARY SCHOOL").sumary, "FACULTY", true)


            },
            {
                text: "SUBSTITUTES",
                x: 1350,
                y: 540,
                width: 180,
                height: 40,
                textsize: 14,
                fontWidth: null,

                background: _JSON_SLIDERS_.Settings.styles.colorLevel4,// null,
                newLine: true,
                link_slide: null,
                showSadow: false,
                coord: {
                    begin: { x: 1600, y: 510 },
                    end: { x: 1440, y: 530 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["SECONDARY SCHOOL"], "SECONDARY SCHOOL").sumary, "SUBSTITUTE TEACHERS", true)



            },
            {
                text: "LAB TECH",
                x: 1670,
                y: 540,
                width: 180,
                height: 40,
                textsize: 14,
                fontWidth: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel4,//  null,
                newLine: false,
                link_slide: null,
                showSadow: false,
                coord: {
                    begin: { x: 1600, y: 510 },
                    end: { x: 1760, y: 530 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["SECONDARY SCHOOL"], "SECONDARY SCHOOL").sumary, "LAB TECH", true)

            },
            {
                text: "COUNSELORS",
                x: 1510,
                y: 620,
                width: 180,
                height: 60,
                fontWidth: null,
                textsize: null,
                background: null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1600, y: 500 },
                    end: { x: 1600, y: 610 }
                },
                dataview: findRowByLabel(_JSON_SLIDERS_.data["SECONDARY SCHOOL"], "COUNSELORS")
            },
            {
                text: "COUNSELOR",
                x: 1350,
                y: 720,
                width: 180,
                height: 40,
                textsize: 14,

                background: _JSON_SLIDERS_.Settings.styles.colorLevel4,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1600, y: 680 },
                    end: { x: 1440, y: 710 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["SECONDARY SCHOOL"], "COUNSELORS").sumary, "COUNSELOR", true)
            },
            {
                text: "COLLEGE COUNSELOR",
                x: 1670,
                y: 720,
                width: 180,
                height: 40,
                textsize: 14,

                background: _JSON_SLIDERS_.Settings.styles.colorLevel4,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1600, y: 680 },
                    end: { x: 1760, y: 710 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["SECONDARY SCHOOL"], "COUNSELORS").sumary, "COLLEGE COUNSELOR", true)
            },

            {
                text: "STUDENT LIFE / CLAW",
                x: 1510,
                y: 800,
                width: 180,
                height: 60,
                fontWidth: null,
                textsize: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1600, y: 690 },
                    end: { x: 1600, y: 790 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["SECONDARY SCHOOL"], "SECONDARY SCHOOL").sumary, "STUDENT LIFE / CLAW", true)


            },
            {
                text: "SECRETARIES",
                x: 1510,
                y: 890,
                width: 180,
                height: 60,
                fontWidth: null,
                textsize: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: true,
                link_slide: null,
                coord: {
                    begin: { x: 1600, y: 860 },
                    end: { x: 1600, y: 880 }
                },
                dataview: findRowByLabel(findRowByLabel(_JSON_SLIDERS_.data["SECONDARY SCHOOL"], "SECONDARY SCHOOL").sumary, "SECRETARY", true)


            },
            {
                text: "LIBRARY",
                x: 860,
                y: 770,
                width: 180,
                height: 60,
                fontWidth: null,
                textsize: null,
                background: _JSON_SLIDERS_.Settings.styles.colorLevel3,// null,
                newLine: true,
                link_slide: null,
                dataview: findRowByLabel(_JSON_SLIDERS_.data["DB & SUPPORT SERVICES"], "LIBRARY")


            },

        ];


        return _Nodes_[_number_page_];

    }

    function GetCoordsArrows(coord) {
        const _line_color_ = _JSON_SLIDERS_.Settings.styles.lines || "#FF0000";
        const _lineWidth_ = 2;
        const _radius_ = 10;
        let _coords_ = [];

        const _angles_ =
        {
            "sector1": [Math.PI, Math.PI * 1.5],
            "sector2": [Math.PI * 1.5, Math.PI * 2],
            "sector3": [Math.PI / 2, Math.PI],
            "sector4": [Math.PI * 2, Math.PI / 2]
        }

        const _groups_lines_ = new Konva.Group({
            name: "arrows_lines"
        });

        let rotate_arrow = 0;
        if (coord.end.x < coord.begin.x && coord.begin.y < coord.end.y) {

            _coords_.push([
                coord.begin.x, coord.begin.y,
                coord.begin.x, (coord.end.y - ((coord.end.y - coord.begin.y) / 2)) - _radius_
            ])


            _groups_lines_.add(new Konva.Shape({
                x: coord.begin.x - _radius_,
                y: (coord.end.y - ((coord.end.y - coord.begin.y) / 2)) - _radius_,

                sceneFunc: (ctx, shape) => {


                    ctx.beginPath();
                    ctx.arc(
                        0,
                        0,
                        _radius_,
                        _angles_.sector4[0],
                        _angles_.sector4[1],
                        false);
                    ctx.strokeStyle = _line_color_;
                    ctx.lineWidth = _lineWidth_;
                    ctx.stroke();
                },
            }));

            _coords_.push([
                coord.begin.x - _radius_, (coord.end.y - ((coord.end.y - coord.begin.y) / 2)),
                coord.end.x + _radius_, coord.end.y - ((coord.end.y - coord.begin.y) / 2)
            ]);


            _groups_lines_.add(new Konva.Shape({
                x: coord.end.x + _radius_,
                y: (coord.end.y - ((coord.end.y - coord.begin.y) / 2)) + _radius_,

                sceneFunc: (ctx, shape) => {

                    ctx.beginPath();
                    ctx.arc(
                        0,
                        0,
                        _radius_,
                        _angles_.sector1[0],
                        _angles_.sector1[1],
                        false);
                    ctx.strokeStyle = _line_color_;
                    ctx.lineWidth = _lineWidth_;
                    ctx.stroke();
                },
            }));


            _coords_.push([
                coord.end.x, (coord.end.y - ((coord.end.y - coord.begin.y) / 2)) + _radius_,
                coord.end.x, coord.end.y
            ]);

            rotate_arrow = 180;

        } else if (coord.begin.x === coord.end.x) {
            _coords_.push([
                coord.begin.x, coord.begin.y,
                coord.end.x, coord.end.y
            ]);
            rotate_arrow = 180;


        } else if (coord.end.x > coord.begin.x && coord.begin.y < coord.end.y && coord.end.x < 1700) {

            if (coord.type && coord.type == "top-bottom") {
                _coords_.push([
                    coord.begin.x, coord.begin.y,
                    coord.begin.x, (coord.end.y - ((coord.end.y - coord.begin.y) / 2)) - _radius_
                ]);

                _groups_lines_.add(new Konva.Shape({
                    x: coord.begin.x + _radius_,
                    y: (coord.end.y - ((coord.end.y - coord.begin.y) / 2)) - _radius_,

                    sceneFunc: (ctx, shape) => {

                        ctx.beginPath();
                        ctx.arc(
                            0,
                            0,
                            _radius_,
                            _angles_.sector3[0],
                            _angles_.sector3[1],
                            false);
                        ctx.strokeStyle = _line_color_;
                        ctx.lineWidth = _lineWidth_;
                        ctx.stroke();
                    },
                }));

                _coords_.push([

                    coord.begin.x + _radius_, (coord.end.y - ((coord.end.y - coord.begin.y) / 2)),
                    coord.end.x - _radius_, (coord.end.y - ((coord.end.y - coord.begin.y) / 2))
                ]);

                _groups_lines_.add(new Konva.Shape({
                    x: coord.end.x - _radius_,
                    y: (coord.end.y - ((coord.end.y - coord.begin.y) / 2)) + _radius_,

                    sceneFunc: (ctx, shape) => {

                        ctx.beginPath();
                        ctx.arc(
                            0,
                            0,
                            _radius_,
                            _angles_.sector2[0],
                            _angles_.sector2[1],
                            false);
                        ctx.strokeStyle = _line_color_;
                        ctx.lineWidth = _lineWidth_;
                        ctx.stroke();
                    },
                }));

                _coords_.push([


                    coord.end.x, (coord.end.y - ((coord.end.y - coord.begin.y) / 2)) + _radius_,
                    coord.end.x, coord.end.y
                ]);


                rotate_arrow = 180;
            } else {
                _coords_.push([
                    coord.begin.x, coord.begin.y,
                    coord.begin.x, coord.end.y - _radius_,
                ]);

                _groups_lines_.add(new Konva.Shape({
                    x: coord.end.x - _radius_,
                    y: coord.end.y - _radius_,

                    sceneFunc: (ctx, shape) => {

                        ctx.beginPath();
                        ctx.arc(
                            0,
                            0,
                            _radius_,
                            _angles_.sector3[0],
                            _angles_.sector3[1],
                            false);
                        ctx.strokeStyle = _line_color_;
                        ctx.lineWidth = _lineWidth_;
                        ctx.stroke();
                    },
                }));

                _coords_.push([
                    coord.begin.x + _radius_, coord.end.y,
                    coord.end.x, coord.end.y,
                ]);

                rotate_arrow = 90;
            }


        } else if (coord.end.x > coord.begin.x && coord.begin.y < coord.end.y && coord.end.x >= 1700) {
            _coords_.push([
                coord.begin.x, coord.begin.y,
                coord.begin.x, (coord.end.y - ((coord.end.y - coord.begin.y) / 2)) - _radius_
            ]);

            _groups_lines_.add(new Konva.Shape({
                x: coord.begin.x + _radius_,
                y: (coord.end.y - ((coord.end.y - coord.begin.y) / 2)) - _radius_,

                sceneFunc: (ctx, shape) => {

                    ctx.beginPath();
                    ctx.arc(
                        0,
                        0,
                        _radius_,
                        _angles_.sector3[0],
                        _angles_.sector3[1],
                        false);
                    ctx.strokeStyle = _line_color_;
                    ctx.lineWidth = _lineWidth_;
                    ctx.stroke();
                },
            }));

            _coords_.push([

                coord.begin.x + _radius_, (coord.end.y - ((coord.end.y - coord.begin.y) / 2)),

                coord.end.x - _radius_, (coord.end.y - ((coord.end.y - coord.begin.y) / 2))


            ]);

            _groups_lines_.add(new Konva.Shape({
                x: coord.end.x - _radius_,
                y: (coord.end.y - ((coord.end.y - coord.begin.y) / 2)) + _radius_,

                sceneFunc: (ctx, shape) => {

                    ctx.beginPath();
                    ctx.arc(
                        0,
                        0,
                        _radius_,
                        _angles_.sector2[0],
                        _angles_.sector2[1],
                        false);
                    ctx.strokeStyle = _line_color_;
                    ctx.lineWidth = _lineWidth_;
                    ctx.stroke();
                },
            }));

            _coords_.push([

                coord.end.x, (coord.end.y - ((coord.end.y - coord.begin.y) / 2)) + _radius_,

                coord.end.x, coord.end.y


            ]);
            rotate_arrow = 180;

        } else if (coord.begin.y == coord.end.y) {
            _coords_.push([
                coord.begin.x, coord.begin.y,
                coord.end.x, coord.end.y
            ]);

            if (coord.type === "right-left") {
                rotate_arrow = 270;
            } else {

                rotate_arrow = 90;
            }

        }

        _groups_lines_.add(new Konva.RegularPolygon({
            x: coord.end.x,
            y: coord.end.y,
            sides: 3,
            radius: (_radius_ - (_radius_ * 0.4)), // mitad de 15 para que ocupe 15px aprox
            fill: (_JSON_SLIDERS_.Settings.styles.lines || "#FF0000"),
            rotation: rotate_arrow
        }));


        _coords_.forEach(_coord_ => {
            _groups_lines_.add(new Konva.Line({
                points: _coord_,
                stroke: _line_color_,
                strokeWidth: _lineWidth_,
                closed: false,
                lineCap: "round",
                lineJoin: "round"
            }));
        });




        return _groups_lines_
    }
    function LoadPage(_print_grid_ = false) {

        _JSON_SLIDERS_.Pages.forEach((page, index) => {
            const _page_slug_ = "page-" + (index + 1);
            const slidersDiv = d3.select("#sliders");
            if (!slidersDiv) {
                return false;
            }
            const slideDiv = slidersDiv.append("div")
                .attr("class", "slide " + (index > 0 ? "hide" : ""));

            const slideContentDIV = slideDiv.append("div")
                .attr("class", "slide-content")
                .attr("id", _page_slug_);

            const stage = new Konva.Stage({
                container: _page_slug_,
                className: "slide-stage",
                width: _VIRTUAL_WIDTH_,
                height: _VIRTUAL_HEIGHT_,
            });


            _JSON_SLIDERS_.Pages[index].slug = _page_slug_;
            _JSON_SLIDERS_.Pages[index].active = (index === 0 ? true : false);

            const _Layout_ = CreateBackgound();

            let _ContentDraw_ = CreateContainer(($("body").hasClass("lines")) ? true : false, "ContentNodes");

            let _arrows_groups_ = CreateContainer(false, "arrows_groups");

            console.groupCollapsed("page", index)
            const _AllNodes_ = GetAllNodes(index);
            if (_AllNodes_) {
                //console.log(JSON.stringify(_AllNodes_, null, 2));
                
                
                _ContentDraw_.add(_HELPERS_.Visual.CreateYellows(index));
                
                _AllNodes_.forEach(function (_node_) {
                    _ContentDraw_.add(crearBox(_node_));
                    if (_node_.coord) {
                        _arrows_groups_.add(GetCoordsArrows(_node_.coord));
                        _arrows_groups_.cache();
                        }
                        });
                        
            }
            console.groupEnd();
            const layer = new Konva.Layer({
                name: _page_slug_
            });

            _Layout_.add(CreateButtonActions(index), _arrows_groups_, _ContentDraw_, CreateTooltip())
            layer.add(_Layout_);
            stage.add(layer);

            __dashOffset__ = 0;


            _ANIMATION_ = new Konva.Animation((frame) => {

                // console.log("Página activa:");
                if (_ANIMATION_.isRunning()) {
                    __dashOffset__ -= 0.3; // velocidad reducida
                    if (__dashOffset__ < -18) __dashOffset__ = 0;
                    const line_dots = layer.find(".line_dots");
                    if (line_dots) {
                        line_dots.forEach(line => {
                            line.dashOffset(__dashOffset__);
                            line.getLayer().batchDraw();
                        });

                    }
                }


            }, layer);


            //


            const lastUpdated = slideContentDIV.append("div")
                .attr("id", "lastUpdated").text("Last updated on: " + _JSON_SLIDERS_.Settings.lastUpdated);



        });

        resizeStage("load");
    }

    window.addEventListener("resize", () => {

        resizeStage("resize");

    });


    async function copyStageToClipboard(_stage_, _slug_) {
        _stage_.findOne(".action_buttons").opacity(0);

        const dataUrl = _stage_.toDataURL({ pixelRatio: 2 }); // Mayor calidad con pixelRatio

        // Convertir base64 a Blob
        const res = await fetch(dataUrl);
        const blob = await res.blob();

        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);
            _stage_.findOne(".action_buttons").opacity(1);
            createPopup(_stage_, _stage_.findOne("." + _slug_), "Your screenshot’s ready — it’s in the clipboard!");
        } catch (err) {
            console.error("Error al copiar la imagen:", err);
        }
    }


    function createPopup(stage = null, layer = null, message = null) {


        const popupWidth = 300;
        const popupHeight = 150;


        const centerX = (_VIRTUAL_WIDTH_ / 2) - (popupWidth / 2);
        const centerY = (_VIRTUAL_HEIGHT_ / 2) - (popupHeight / 2);

        const popupGroup = new Konva.Group({
            x: centerX,
            y: centerY,
            name: "popup_box"
        });


        const BackgroundFixed = new Konva.Rect({
            width: popupWidth,
            height: popupHeight,
            x: 0,
            y: 0,
            offsetX: popupWidth / 2,
            offsetY: popupHeight / 2,
            fill: "#043815",
            opacity: 0.6,
            scaleX: 50,
            scaleY: 50
        });


        const WidthBorder = 25;
        const cornerRadius = 10;
        const border = new Konva.Rect({
            width: popupWidth + WidthBorder,
            height: popupHeight + WidthBorder,
            x: -(WidthBorder / 2),
            y: -(WidthBorder / 2),
            fill: "#fff",
            opacity: 0.4,
            stroke: "#444",
            strokeWidth: 1,
            cornerRadius: cornerRadius + (WidthBorder / 2),
            shadowColor: "black",
            shadowBlur: 10,
            shadowOpacity: 0.15
        });


        const background = new Konva.Rect({
            width: popupWidth,
            height: popupHeight,
            fill: "#fff",

            cornerRadius: cornerRadius,

        });
        popupGroup.add(BackgroundFixed, border, background);



        // botón
        const btnWidth = 100;
        const btnHeight = 40;
        const buttonY = popupHeight - btnHeight - 20;

        const button = new Konva.Rect({
            x: (popupWidth - btnWidth) / 2,
            y: buttonY,
            width: btnWidth,
            height: btnHeight,
            fill: "#00aaff",
            cornerRadius: 8,
            shadowColor: "black",
            shadowBlur: 4,
            shadowOpacity: 0.2
        });
        popupGroup.add(button);


        // mensaje centrado verticalmente entre borde superior y botón
        const availableHeight = buttonY - 20; // espacio desde y=20 hasta arriba del botón
        const text = new Konva.Text({
            x: 20,
            y: 20 + (availableHeight - 16) / 2, // 16 ~ fontSize
            width: popupWidth - 40,
            text: message,
            fontSize: 16,
            fontFamily: "Calibri",
            fill: "#000",
            align: "center"
        });
        popupGroup.add(text);

        // texto del botón centrado
        const buttonText = new Konva.Text({
            x: button.x(),
            y: button.y() + (btnHeight / 2) - 8, // 8 ~ mitad del fontSize
            width: btnWidth,
            text: "OK",
            fontSize: 16,
            fontFamily: "Calibri",
            fill: "#fff",
            align: "center",
            listening: false
        });
        popupGroup.add(buttonText);

        // eventos cerrar
        const closeFn = () => {
            popupGroup.destroy();
            stage.container().style.cursor = "default";
            layer.draw();
        };
        button.on("click", closeFn).on("mouseenter", () => {
            stage.container().style.cursor = "pointer";
        }).on("mouseleave", () => {
            stage.container().style.cursor = "default";
        });
        buttonText.on("click", closeFn);


        layer.add(popupGroup);
        layer.draw();
    }




    /*
     *  ----------------------------------------
     *  EVENTS JQUERY
     *  ----------------------------------------
     */
    $(document).on("fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange", function () {
        if (
            !document.fullscreenElement &&
            !document.webkitFullscreenElement &&
            !document.mozFullScreenElement &&
            !document.msFullscreenElement
        ) {
            // Salió del modo de pantalla completa

            $(".icon_minimize").parent().addClass("btn-hidden");
            $(".icon_maximize").parent().removeClass("btn-hidden");
        } else {
            // Entró en modo de pantalla completa
        }

        resizeStage("fullscreenchange");
    });

    $("body").on("click", "#content_center", function (e) {

        if (!$(e.target).closest("#content_datatable").length) {

            $("#content_center").remove();
        }
    });

    $(window).load(function () {
        document.fonts.ready.then(() => {
            Konva.pixelRatio = window.devicePixelRatio;
            LoadPage($("body").hasClass("lines"));
            // create_Menu();
        });
    });

});
