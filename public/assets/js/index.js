import { getPivotTable } from "./api.js";

const app = Vue.createApp({
  data() {
    return {
      pivotTableData: [],
      columnNamesHashes: {},
      columns: [],
      changedColumnData: {
        index: -1,
        downClientX: null,
        oldWidth: null,
        needForRAF: true,
      },
    };
  },

  MIN_COLUMN_WIDTH: 150,

  computed: {
    /* columns() {
      if (this.pivotTableData.length === 0) {
        return [];
      }

      return Object.keys(this.pivotTableData[0]).map((key) => ({
        name: key,
        title: this.columnNamesHashes[key] || key,
        width: 150,
      }));
    },*/
  },

  watch: {
    columns: {
      handler() {
        if (!this.$refs.table) return;

        this.$refs.table.style.gridTemplateColumns = this.columns
          .map((column) => `${column.width}px`)
          .join(" ");
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    initColumns() {
      if (this.pivotTableData.length === 0) {
        this.columns = [];
        return;
      }

      this.columns = Object.keys(this.pivotTableData[0]).map((key) => ({
        name: key,
        title: this.columnNamesHashes[key] || key,
        width: this.$options.MIN_COLUMN_WIDTH,
      }));
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

    mouseUp(event) {
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
  },

  async mounted() {
    const response = await getPivotTable();
    this.pivotTableData = response.data.items;
    this.columnNamesHashes = response.data["column_names_hashes"];

    this.initColumns();

    document.addEventListener("mousemove", this.mouseMove);
    document.addEventListener("mouseup", this.mouseUp);
  },

  unmounted() {
    document.removeEventListener("mousemove", this.mouseMove);
    document.removeEventListener("mouseup", this.mouseUp);
  },

  // <th v-for="(column, index) in columns" :key="index" @mousemove="mouseMove" @mouseup="mouseUp">

  template: `
    <table ref="table">
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index">
            <span>{{ column.title }}</span>
            <div class="resizer" :data-column-name="column.name" @mousedown="mouseDown"></div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(carInfoItem, index) in pivotTableData" :key="index">
          <td v-for="(carInfoKey, index) in Object.keys(carInfoItem)" :key="index">
            {{ Array.isArray(carInfoItem[carInfoKey]) ? carInfoItem[carInfoKey].join(", ") : carInfoItem[carInfoKey] }}
          </td>
        </tr>
      </tbody>
    </table>
  `,
});

app.mount("#app");
