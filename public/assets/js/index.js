import { getShopsCarsTable } from "./api.js";

const app = Vue.createApp({
  data() {
    return {
      pivotTableData: [],
      loading: false,
      columns: [],
      // Данные для обработки событий по изменению ширины колонки
      changedColumnData: {
        index: -1, // индекс колонки
        downClientX: null, // X-координата колонки
        oldWidth: null, // ширина колонки до начала её изменения
        needForRAF: true, // необходим ли вызов функции request animation frame
      },
    };
  },

  computed: {
    // Возвращает стиль для объединения ячеек при отображении таблицы с пустыми данными
    styleForEmptyDataElement() {
      return `grid-column: 1 / ${this.columns.length + 1}`;
    },
  },

  // Минимальная ширина столбов по умолчанию
  MIN_COLUMN_WIDTH: 150,

  watch: {
    // При изменении свойства, отвечающего за ширину колонок меняем обновляем стили таблицы для применения эффекта
    columns: {
      async handler() {
        await this.$nextTick();

        if (!this.$refs.table) {
          return;
        }

        this.$refs.table.style.gridTemplateColumns = this.columns
          .map((column) => `${column.width}px`)
          .join(" ");
      },
      deep: true,
    },
  },

  methods: {
    async fetchData() {
      this.loading = true;

      try {
        const response = await getShopsCarsTable();

        // Данные таблицы
        this.pivotTableData = response.data.items;

        // Свойства колонок
        this.columns = Object.entries(response.data.column_titles).map(
          ([columnName, columnTitle]) => ({
            name: columnName,
            title: columnTitle,
            width: this.$options.MIN_COLUMN_WIDTH,
          })
        );
      } catch (err) {
      } finally {
        this.loading = false;
      }
    },

    mouseDown(event) {
      // имя колонки, на которой было событие нажатия мыши
      const columnName = event.target.dataset.columnName;

      // устанавливаем X-координату, в которой произошло нажатие
      this.changedColumnData.downClientX = event.clientX;

      // Индекс колонки
      this.changedColumnData.index = this.columns.findIndex(
        (column) => column.name === columnName
      );

      // Первоначальная ширина колонки (до того, как начали менять её ширину)
      this.changedColumnData.oldWidth =
        this.columns[this.changedColumnData.index].width;
    },

    mouseUp() {
      // сбрасываем данные
      this.changedColumnData.index = -1;
      this.changedColumnData.downClientX = null;
      console.log(this.count1, this.count2);
    },

    mouseMove(event) {
      if (
        event.buttons === 1 &&
        this.changedColumnData.needForRAF &&
        this.changedColumnData.index > -1
      ) {
        this.changedColumnData.needForRAF = false;

        // используем для оптимизации анимации
        requestAnimationFrame(() => {
          this.changedColumnData.needForRAF = true;
          if (!this.changedColumnData.downClientX) return;

          // Определяем разницу, на сколько изменилась ширина колонки
          const diffX = event.clientX - this.changedColumnData.downClientX;

          // Новое значение ширины на данном шаге анимации
          const newWidth = this.changedColumnData.oldWidth + diffX;

          // Если ширина не меньше минимально допустимой, устанавливаем её
          if (newWidth >= this.$options.MIN_COLUMN_WIDTH) {
            this.columns[this.changedColumnData.index].width = newWidth;
          }
        });
      }
    },

    isPhonesColumn(columnName) {
      return columnName === "shop_phones";
    },

    hrefForPhone(phoneNumber) {
      return `tel:${phoneNumber}`;
    },
  },

  async mounted() {
    await this.fetchData();
    document.addEventListener("mousemove", this.mouseMove);
    document.addEventListener("mouseup", this.mouseUp);
  },

  unmounted() {
    document.removeEventListener("mousemove", this.mouseMove);
    document.removeEventListener("mouseup", this.mouseUp);
  },

  template: `
    <table v-if="!loading" ref="table">
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index">
            <span>{{ column.title }}</span>
            <div class="resizer" :data-column-name="column.name" @mousedown="mouseDown"></div>
          </th>
        </tr>
      </thead>

      <tbody>
        <template v-if="pivotTableData.length > 0">
          <tr v-for="(carInfoItem, index) in pivotTableData" :key="index">
            <td v-for="(carInfoKey, index) in Object.keys(carInfoItem)" :key="index" :class="{phones: isPhonesColumn(carInfoKey)}">
              <template v-if="isPhonesColumn(carInfoKey)">
                <span v-for="(item, index) in carInfoItem[carInfoKey]" :key="index">
                  <a :href="hrefForPhone(item)">{{ item }}</a>
                </span>
              </template>

              <span v-else>
                {{ carInfoItem[carInfoKey] }}
              </span>
            </td>
          </tr>
        </template>

        <tr v-else>
          <td :style="styleForEmptyDataElement" class="empty-data">
              Нет данных
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="skeleton">
      Загрузка...
    </div>
  `,
});

app.mount("#app");
