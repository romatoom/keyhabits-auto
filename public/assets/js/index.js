import { getShopsCarsTable } from "./api.js";

const app = Vue.createApp({
  data() {
    return {
      pivotTableData: [],
      loading: false,
      columns: [],
      changedColumnData: {
        index: -1,
        downClientX: null,
        oldWidth: null,
        needForRAF: true,
      },
    };
  },

  computed: {
    styleForEmptyDataElement() {
      return `grid-column: 1 / ${this.columns.length + 1}`;
    },
  },

  MIN_COLUMN_WIDTH: 150,

  watch: {
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

        this.pivotTableData = response.data.items;

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
      const columnName = event.target.dataset.columnName;

      this.changedColumnData.downClientX = event.clientX;

      this.changedColumnData.index = this.columns.findIndex(
        (column) => column.name === columnName
      );

      this.changedColumnData.oldWidth =
        this.columns[this.changedColumnData.index].width;
    },

    resetIndexOfColumnChangable() {
      this.changedColumnData.index = -1;
      this.changedColumnData.downClientX = null;
    },

    mouseUp() {
      this.resetIndexOfColumnChangable();
    },

    mouseMove(event) {
      if (
        event.buttons === 1 &&
        this.changedColumnData.needForRAF &&
        this.changedColumnData.index > -1
      ) {
        this.changedColumnData.needForRAF = false;

        requestAnimationFrame(() => {
          this.changedColumnData.needForRAF = true;
          if (!this.changedColumnData.downClientX) return;

          const diffX = event.clientX - this.changedColumnData.downClientX;

          const newWidth = this.changedColumnData.oldWidth + diffX;

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
