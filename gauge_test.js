new Vue({
  el: "#app",
  data() {
    return {
      checkedGood: 0,
      totalGood: 0,
      checkedBad: 0,
      totalBad: 0,
      goodChecked: [false, false, false, false, false],
      badChecked: [false, false, false, false, false],
      options: [
        {
          value: 0,
          label: "보빈님",
        },
        {
          value: 1,
          label: "진성님",
        },
        {
          value: 2,
          label: "승훈님 1",
        },
        {
          value: 3,
          label: "승훈님 2",
        },
        {
          value: 4,
          label: "승훈님 3",
        },
      ],
      strategyIndex: null,
      strategyText: [
        {
          each: "기준 50% + (-50% 7개 체크 중 퍼센티지) + (50% 5개 체크 중 퍼센티지) = 0% ~ 100%",
          total: "각 값의 평균",
        },
        {
          each: "",
          total: "일화 작성시마다 누적 평균 내기",
        },
        {
          each: "",
          total:
            "이전 score * 0.9 + (부정 체크 * 4 - (부정 체크 안한 갯수 * 1 + 긍정 체크 * 2))",
        },
        {
          each: "",
          total: "시작 각각 50, 이전 score + (부정 체크 * 3 - 긍정 체크 * 2)",
        },
        {
          each: "",
          total: "이전 score * 0.9 + 체크 수 * 3 - 체크 안한 수 * 1",
        },
      ],
      strategies: [
        () => {
          for (let i = 0; i < this.diaryCount; i++) {
            const good = this.goodChecklist[i];
            const bad = this.badChecklist[i];

            const goodCount = good.filter((ele) => ele == true).length;
            const badCount = bad.filter((ele) => ele == true).length;

            const currentScore = 50 - 10 * goodCount + 10 * badCount;
            const newAverage = (currentScore + this.totalScore * i) / (i + 1);

            this.totalScore = newAverage;
          }
        },

        () => {
          this.totalScore = (this.checkedBad / (this.diaryCount * 5)) * 100;
          this.goodTotalScore =
            (this.checkedGood / (this.diaryCount * 5)) * 100;
        },

        () => {
          console.log(" ");
          for (let i = 0; i < this.diaryCount; i++) {
            const good = this.goodChecklist[i];
            const bad = this.badChecklist[i];

            const goodCount = good.filter((ele) => ele == true).length;
            const badCount = bad.filter((ele) => ele == true).length;

            const currentScore = (badCount * 4) - ((5 - badCount) + (goodCount * 2));

            this.totalScore = this.totalScore * 0.9 + currentScore;
            console.log(this.totalScore)
          }
        },

        () => {
          console.log(" ");
          this.totalScore = 50;
          for (let i = 0; i < this.diaryCount; i++) {
            const good = this.goodChecklist[i];
            const bad = this.badChecklist[i];

            const goodCount = good.filter((ele) => ele == true).length;
            const badCount = bad.filter((ele) => ele == true).length;

            const currentScore = badCount * 3 - goodCount * 2;

            this.totalScore += currentScore;
            console.log(this.totalScore)
          }
        },

        () => {
          console.log(" ");
          for (let i = 0; i < this.diaryCount; i++) {
            const good = this.goodChecklist[i];
            const bad = this.badChecklist[i];

            const goodCount = good.filter((ele) => ele == true).length;
            const badCount = bad.filter((ele) => ele == true).length;

            const currentGoodScore = goodCount * 3 - (5 - goodCount);
            const currentBadScore = badCount * 3 - (5 - badCount);
            

            this.totalScore = this.totalScore * 0.9 + currentBadScore;
            this.goodTotalScore = this.goodTotalScore * 0.9 + currentGoodScore;
            console.log(this.totalScore);
            console.log(this.goodTotalScore);
          }
        },
      ],
      totalScore: 0,
      goodTotalScore: 0,
      diaryCount: 0,
      goodChecklist: [],
      badChecklist: [],
    };
  },
  mounted() {},
  methods: {
    addDiary() {
      this.diaryCount++;
      this.goodChecklist.push(this.goodChecked.slice());
      this.badChecklist.push(this.badChecked.slice());

      this.checkedGood = 0;
      this.checkedBad = 0;

      this.goodChecklist.forEach((list) => {
        this.checkedGood += list.filter((ele) => ele == true).length;
      });
      this.badChecklist.forEach((list) => {
        this.checkedBad += list.filter((ele) => ele == true).length;
      });

      this.totalGood = this.diaryCount * 5;
      this.totalBad = this.diaryCount * 5;

      this.totalScore = 0;
      this.goodTotalScore = 0;
      this.strategies[this.strategyIndex]();
      this.totalScore = Number(this.totalScore.toFixed(0));
      this.goodTotalScore = Number(this.goodTotalScore.toFixed(0));

      if (this.totalScore > 100) {
        this.totalScore = 100;
      } else if (this.totalScore < 0) {
        this.totalScore = 0;
      }
      

      if (this.goodTotalScore > 100) {
        this.goodTotalScore = 100;
      } else if (this.goodTotalScore < 0) {
        this.goodTotalScore = 0;
      }
    },

    clear() {
      this.diaryCount = 0;
      this.totalGood = 0;
      this.totalBad = 0;
      this.checkedGood = 0;
      this.checkedBad = 0;
      this.totalScore = this.strategyIndex == 3 ? 50 : 0;
      this.goodTotalScore = 0;
      this.goodChecklist = [];
      this.badChecklist = [];
    },

    changeStrategy() {
      this.totalScore = 0;
      this.goodTotalScore = 0;

      if (this.strategyIndex == 3) {
        this.totalScore = 50;
      }

      if (this.goodChecklist.length > 0) {
        this.strategies[this.strategyIndex]();
        this.totalScore = Number(this.totalScore.toFixed(0));
        this.goodTotalScore = Number(this.goodTotalScore.toFixed(0));

        if (this.totalScore > 100) {
          this.totalScore = 100;
        } else if (this.totalScore < 0) {
          this.totalScore = 0;
        }
        
  
        if (this.goodTotalScore > 100) {
          this.goodTotalScore = 100;
        } else if (this.goodTotalScore < 0) {
          this.goodTotalScore = 0;
        }
      }

    }
  },
});
