#include <stdio.h>
#define length(x) (sizeof x) / (sizeof x[0])
#define insertSort(x) insertSort_(x,length(x)) 

void insertSort_(int x[], int len){ //wtf is len!
    int i,j,cur;
    for (i=1;i<len;i++){
        cur = x[i];
        j = i - 1; // from the back to the forward
        for (j;j>=0&&x[j]>cur;j--){
            x[j+1]=x[j];
        }
        x[j+1] = cur;
    }
}

int main() {
    int array[]= {1,3,4142,123,4,1,41,12315,31135,234};
    int i;
    insertSort(array);
    for (i=0;i<length(array);i++){
        printf("%d ",array[i]);
    }
    printf("\n");
    return 0;
}