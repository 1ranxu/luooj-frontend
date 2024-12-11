<template>
  <div>
    <a-button
      @click="
        () => {
          router.push(
            route.fullPath.substring(0, route.fullPath.lastIndexOf('s') - 1) +
              '?tab=answers'
          );
        }
      "
    >
      返回
    </a-button>
    <h1>题解详情：{{ props.questionSolutionId }}</h1>
    <a-card v-if="questionSolution.content" @click="">
        <MDViewer :value="questionSolution.content || ''" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref, withDefaults } from "vue";
import { useRoute, useRouter } from "vue-router";
import { QuestionSolutionControllerService } from "../../../generated/services/QuestionSolutionControllerService";
import message from "@arco-design/web-vue/es/message";
import MDViewer from "@/components/MDViewer.vue";
const router = useRouter();
const route = useRoute();

// 获取题解id
interface Props {
  questionSolutionId: string;
}
const props = withDefaults(defineProps<Props>(), {
  questionSolutionId: () => "",
});

// 题解
const questionSolution = ref({

});

// 获取题解
const getQuestionSolution = async () =>{
  const res = await QuestionSolutionControllerService.getQuestionSolutionByIdUsingGet(props.questionSolutionId)
  if(res.code == 0){
    questionSolution.value = res.data;
  }else{
    message.error(""+res.message);
  }
}

onMounted(()=>{
  getQuestionSolution();
})
</script>

<style scoped></style>