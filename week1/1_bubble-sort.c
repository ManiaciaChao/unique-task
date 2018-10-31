#include <stdio.h>
#define length(x) (sizeof x) / (sizeof x[0])
#define bubbleSort(x) bubbleSort_(x, length(x))

void swap(int *x, int *y) {
    int t = *x;
    *x = *y;
    *y = t;
}

void bubbleSort_(int a[], int len) {
    int i;
    for (; len >= 0; len--) {
        for (i = 0; i < len - 1; i++) {
            if (a[i] > a[i + 1]) {
                swap(&a[i], &a[i + 1]);
            }
        }
    }
}

int main() {
    int array[] = {1, 3, 4142, 123, 4, 1, 41, 12315, 31135, 234};
    int i;
    bubbleSort(array);
    for (i = 0; i < length(array); i++) {
        printf("%d ", array[i]);
    }
    printf("\n");
    return 0;
}